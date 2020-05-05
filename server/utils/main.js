// Libs & utils
import express from 'express'
import http from 'http'
import socketIo from 'socket.io'
import debugFactory from 'debug'
import { generalUtils } from './utils/index'
import compression from 'compression'
import helmet from 'helmet'
import path from 'path'
import { party, user } from './core'
import { socketUtils, generalUtils } from "./utils"
import { ACTION_TYPES } from './core/constants'

// Constants
const partySocketHandlers = {
	'WS_TO_SERVER_CREATE_PARTY': createParty,
	'WS_TO_SERVER_SEND_MESSAGE_TO_PARTY': sendMessageToParty,
	'WS_TO_SERVER_SET_VIDEO_PLAYER_STATE': setVideoPlayerStateForParty
}

const userSocketHandlers = {
	'WS_TO_SERVER_CONNECT_TO_PARTY': connectToParty,
	'WS_TO_SERVER_DISCONNECT_FROM_PARTY': disconnectFromParty,
	'WS_TO_SERVER_SET_CLIENT_READY_STATE': setUserReadyState,
	'WS_TO_SERVER_SET_CLIENT_VIDEOPLAYER_INITIALIZED': setUserReadyState,
}


function createParty ( io, socket, video ) {
	const partyId = party.createParty ( io, socket, video )

	socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_PARTY_ID, partyId )
}

// Broadcasting to whole party with 
/** 
@param payload
**/ 
function sendMessageToParty ( io, socket, payload ) {
	const { message, partyId, userName } = payload

	if ( message && partyId && userName ) {
		party.sendMessageToParty ( io, message, partyId, userName )
	}
}

//  Set a videoPlayer state for an entire party
//  ( Triggered when a user in a party i.e. pauses, seeks in or plays the video )

function setVideoPlayerStateForParty ( io, socket, payload ) {
	const userId = socket.id
	const { newPlayerState, partyId } = payload
	const playerStateForParty = {
		playerState: newPlayerState.playerState,
		timeInVideo: generalUtils.RoundOFF ( newPlayerState.timeInVideo, 2 )
	}

	if ( user.isUserAuthenticated ( userId ) ) {
		party.onNewPlayerStateForParty ( io, socket, partyId, playerStateForParty )
	}
}

async function connectToParty ( io, socket, payload ) {
	const userId = socket.id
	const { userName, partyId } = payload

	// Check party Existance
	// If party Doesn't exist notify user
	if ( !party.partyExists ( partyId ) ) {
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_PARTY_STATE, 'inactive' )
		return false
	}else{
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_PARTY_STATE, 'active' )
	}

	// Create a new user if the user doesn't already exists
	 user.createNewUser ( userId, userName )

	// Add user to the party
	user.addUserToParty ( io, socket, partyId, userName )

	// Send party details to the user about joining
	party.sendPartyDetailsToClient ( socket, partyId )

	// notify the party that a new user has joined upon authentication
	if ( user.isUserAuthenticated ( userId ) ) {
		party.notifyPartyOfNewlyJoinedUser ( io, partyId, userName )
	}
}


//  Disconnect a client from all parties it is currently connected to
 
function disconnectFromParty ( io, socket ) {
	user.disconnectFromParty ( io, socket )
	user.resetClientToInitialState ( socket )
}


// Mark a user as readyToPlay [== done buffering] or !readyToPlay [== buffering]
// Either a user has finished buffering and is ready to play or Not

function setUserReadyState ( io, socket, payload ) {
	const userId = socket.id
	const partyIdForUser = user.getPartyIdForUser ( userId )
	// Don't continue if this user is not a member of any parties
	if ( !partyIdForUser ) {
		return false
	}

	const { clientIsReady, timeInVideo } = payload
	const userForId = user.getUserForId ( userId )
	const isNewReadyStateForClient = clientIsReady !== userForId.readyToPlayState.clientIsReady
	const readyToPlayState = {
		clientIsReady,
		timeInVideo: generalUtils.RoundOFF ( timeInVideo, 2 )
	}

	// If the user is now ready to play
	// OR if this client is not ready to play (because of buffering)
	// -> store that readyToPlay state for the user
	if ( isNewReadyStateForClient || !clientIsReady ) {
		// Store the new userReadyState for the user
		user.setUserReadyToPlayState ( userId, readyToPlayState )
	}

	if ( !clientIsReady ) {
		// user not ready to play -> pause the video for everyone in the party until user ready
		party.handleUserInPartyNotReady ( io, userId, partyIdForUser )
	} else if ( isNewReadyStateForClient && party.allUsersReady ( partyIdForUser ) ) {
		// all users are ready -> play video for everyone in party
		party.handleAllUsersInPartyReady ( io, partyIdForUser )
	}
}

// Location constant variables
const Path_Configuration = {
	indexHtml: path.resolve ( __dirname, '../build/index.html' ),
	static: path.resolve ( __dirname, '../build' )
}


const Route_Configuration = {
	configureRoutes: app => {
		const router = new express.Router ()
		const htmlFile = Path_Configuration.indexHtml

		router.all ( '*', ( req, res ) => {
			res.sendFile ( htmlFile )
		} )

		app.use ( router )
	}
}


const App_Configuration = {
	// server address
	host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT || 3001,

	configureApp: app => {
		// server address
		app.set ( 'host', App_Configuration.host )
		app.set ( 'port', App_Configuration.port )

		// HTTP headers
		app.disable ( 'x-powered-by' )
		app.use ( helmet.frameguard ( { action: 'deny' } ) )
		app.use ( helmet.noSniff () )
		app.use ( helmet.xssFilter () )
		app.use ( helmet.ieNoOpen () )

		// gzip compression
		app.use ( compression () )

		// static files
		app.use ( express.static ( Path_Configuration.static, { index: false } ) )
	}
}

//initialization 
const ENV_PRODUCTION = process.env.NODE_ENV === 'production'
const debug = debugFactory ( 'APP:MAIN' )
const app = express ()

// Only use express to serve static client build in production mode
const server = ENV_PRODUCTION ? http.Server ( app ) : http.Server ()
const io = socketIo ( server )

App_Configuration.configureApp ( app )
Route_Configuration.configureRoutes ( app )

//server listen
server.listen ( App_Configuration.port, App_Configuration.host, error => {
	if ( error ) {
		debug ( error )
	}
	else {
		debug ( `Server listening @ ${App_Configuration.host}:${App_Configuration.port}` )
	}
} )


//socket i/o
io.on ( 'connection', async( socket ) => {
	// Debug information about user connection
	debug ( `User with id ${socket.id} connected` )

	//  Merge all separate eventHandlers into one objects
	var eventHandlers = await generalUtils.mergeObjectsInArray ( [
		partySocketHandlers,
		userSocketHandlers
	] )

	// Bind eventHandlers to  actions
	socket.on ( 'action', ( action ) => {
		const eventHandler = eventHandlers[ action.type ]

		// If there is an eventHandler for  actionType
		// -> execute that eventHandler with parameters like below
		if ( eventHandler ) {
			eventHandler ( io, socket, action.payload )
		}
	} )

	// When a client disconnects -> remove the clientId from all parties 
	socket.on ( 'disconnect', () => {
		debug ( `User with id ${socket.id} disconnected` )
		userSocketHandlers.WS_TO_SERVER_DISCONNECT_FROM_PARTY ( io, socket )
	} )
} )


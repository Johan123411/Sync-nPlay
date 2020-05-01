// Libs & utils
import { cache, user } from './'
import { generalUtils, socketUtils } from '../utils'

// Constants
import { ACTION_TYPES, serverUserName } from '../core/constants'


	const messageUtils = {
	//* Generate a message to let other users know that a new user joined the party
		generateUserJoinedMessage: ( userName, partyId, serverUserName ) => {
			return { message: `${userName} joined the party`, userName: serverUserName, partyId }
		}
	}
	
	//Toggle the videoPlayer interval that keeps track of the time progression of the video

	function toggleVideoPlayerInterval ( partyId, turnOn ) {
		const partyForId = party.getPartyById ( partyId )
		const videoPlayerForParty = party.getVideoPlayerForParty ( partyId )

		// Start keeping track of the time in the video while the video is playing
		if ( turnOn && !partyForId.videoPlayerInterval ) {
			if ( !partyForId.videoPlayerInterval ) {
				partyForId.videoPlayerInterval = setInterval ( () => {
					videoPlayerForParty.timeInVideo += 1
				}, 1000 )
			}
		} else if ( partyForId.videoPlayerInterval ) {
			// Clear interval keeping track of time progression said party
			clearInterval ( partyForId.videoPlayerInterval )
			partyForId.videoPlayerInterval = null
		}
	}

	
	//Start playing the video for all clients in a party
	function playVideoForParty ( io, partyId ) {
		const videoPlayerForParty = party.getVideoPlayerForParty ( partyId )

		// Start a new interval - keeps track of time progression of video
		party.toggleVideoPlayerInterval ( partyId, true )

		// Emit the 'play' command/action to everyone 
		socketUtils.emitActionToParty ( io, partyId, ACTION_TYPES.SET_CLIENT_PLAYER_STATE, {
			playerState: 'playing',
			timeInVideo: videoPlayerForParty.timeInVideo
		} )
	}


	//Pause the videoPlayer for members of party and option to exclude
	//client initiating pause action () his videoPlayer will already be paused)
	 
	function pauseVideoForParty( io, partyId, videoPlayerState )  {
		// Stop  videoInterval
		party.toggleVideoPlayerInterval ( partyId, false )

		// Emit the 'pause' action to everyone
		socketUtils.emitActionToParty ( io, partyId, ACTION_TYPES.SET_CLIENT_PLAYER_STATE, {
			playerState: 'paused',
			timeInVideo: videoPlayerState.timeInVideo
		} )
	}

	// Check if the party is currently waiting for all users to finish buffering
	// and notify all users - waiting or ready to play
	 
	function togglePartyWaitingToBeReady( io, partyId, isNowWaitingForAllUsersToBeReady ) {
		const partyForId = party.getPartyById ( partyId )
		const currentlyWaitingToBeReady = partyForId.waitingForAllUsersToBeReady

		// Point 1: If the party was previously waiting to be ready and is now ready
		if ( currentlyWaitingToBeReady && !isNowWaitingForAllUsersToBeReady ) {
			party.sendMessageToParty ( io, 'All Set!', partyId, serverUserName )
		}
		// converse of Point 1
		else if ( !currentlyWaitingToBeReady && isNowWaitingForAllUsersToBeReady ) {
			party.sendMessageToParty ( io, 'Someone\'s still Buffering!! Wait up!! ..', partyId, serverUserName )
		}

		partyForId.waitingForAllUsersToBeReady = isNowWaitingForAllUsersToBeReady
	}


	//Returns true if all users done buffering
	function allUsersReady ( partyId ) {
		const usersInParty = party.getUsersForParty ( partyId )

		const usersThatAreReady = usersInParty.filter ( ( userInParty ) => {
			return userInParty.readyToPlayState.clientIsReady
		} )

		return usersInParty.length === usersThatAreReady.length
	}


	//User buffering -> trigger pause fpr all in party
	function handleUserInPartyNotReady ( io, userId, partyIdForUser ) {
		const userForId = user.getUserForId ( userId )
		const readyToPlayStateForUser = userForId.readyToPlayState
		// videoPlayer seek for user =  0 seconds, then
		// -> this userReadyState is nitial ready state for this user
		const isInitialReadyStateForClient = readyToPlayStateForUser.timeInVideo === 0

		if ( !isInitialReadyStateForClient ) {
			party.pauseVideoForParty ( io, partyIdForUser, readyToPlayStateForUser )
			party.togglePartyWaitingToBeReady ( io, partyIdForUser, true )
		} else if ( isInitialReadyStateForClient ) {
			// Stop the videoInterval
			party.toggleVideoPlayerInterval ( partyIdForUser, false )
		}
	}


	//When users ready -> play video for party
	function handleAllUsersInPartyReady ( io, partyId )  {
		const partyForId = party.getPartyById ( partyId )
		const currentPlayerStateForParty = partyForId.videoPlayer.playerState

		if ( currentPlayerStateForParty === 'playing' ) {
			party.playVideoForParty ( io, partyId )
			party.togglePartyWaitingToBeReady ( io, partyId, false )
		}
	}


	//Event handler for when a user tries to change the videoPlayer state for a party

	function onNewPlayerStateForParty ( io, socket, partyId, newPlayerState ) {
		const partyForId = party.getPartyById ( partyId )

		// Clear the videoPlayer interval for party
		party.toggleVideoPlayerInterval ( partyId, false )

		const newVideoPlayerStateForParty = {
			lastStateChangeInitiator: socket.id,
			playerState: newPlayerState.playerState,
			timeInVideo: newPlayerState.timeInVideo
		}

		// Set the new videoPlayer state 
		partyForId.videoPlayer = newVideoPlayerStateForParty

		// Play / pause video 
		if ( newPlayerState.playerState === 'playing' ) {
			party.playVideoForParty ( io, partyId )
		} else {
			party.pauseVideoForParty ( io, partyId, newVideoPlayerStateForParty )
		}
	}
	//Returns true if party already exists
	function partyExists( partyId ) {
		const partyIds = cache.parties.map ( activeParty => activeParty.partyId )
		return partyIds && partyIds.indexOf ( partyId ) !== -1
	}

	//Get a party by partyId
	function getPartyById( partyId ) {
		return cache.parties.find ( ( activeParty ) => activeParty.partyId && activeParty.partyId === partyId )
	}

	//Create a new party and set the selected video details for the party
	function createParty ( io, socket, videoDetails ) {

		// Generate unique partyId
		let partyId = generalUtils.generateId ()
		while ( party.partyExists ( partyId ) ) {
			partyId = generalUtils.generateId ()
		}
		
		// Add a new party to the parties array
		cache.parties.push ( {
			partyId,
			selectedVideo: videoDetails,
			waitingForAllUsersToBeReady: false,
			videoPlayer: {
				playerState: 'paused',
				timeInVideo: 0,
				lastStateChangeInitiator: null
			},
			videoPlayerInterval: null,
			usersInParty: [],
			messagesInParty: [],
		} )

		return partyId
	}

	//Get the selected video object for the party with given partyId
	function getSelectedVideoForParty( partyId ) {
		const partyForId = party.getPartyById ( partyId )

		return partyForId && partyForId.selectedVideo ?
			partyForId.selectedVideo : {}
	}


	//Get the videoPlayer object (the playerState) for a specific party
	function getVideoPlayerForParty( partyId ) {
		const partyForId = party.getPartyById ( partyId )
		return partyForId && partyForId.videoPlayer
			? partyForId.videoPlayer
			: {}
	}

	//Retrieve all users that are in a specific party
	function getUsersForParty ( partyId ) {
		const partyForId = party.getPartyById ( partyId )
		const userIdsInParty = partyForId ? partyForId.usersInParty : []

		const usersInParty = userIdsInParty.map ( ( userId ) => {
			return user.getUserForId ( userId )
		} )

		return usersInParty
	}

	
	//Retrieve all messages that were posted inside a party from the [MESSAGE ARRAY]

	function getMessagesInParty( partyId ) {
		const partyForId = cache.parties.find ( ( activeParty ) => activeParty.partyId === partyId )

		return partyForId && partyForId.messagesInParty ? partyForId.messagesInParty : []
	}

	//Send details of a party to a specified client
	function sendPartyDetailsToClient ( socket, partyId ) {
		if ( !party.partyExists ( partyId ) ) {
			return false
		}

		// Gather the selected video details for the party
		const videoForParty = party.getSelectedVideoForParty ( partyId )
		// Get the current Video player state for the party
		const videoPlayerForParty = party.getVideoPlayerForParty ( partyId )
		const usersInParty = party.getUsersForParty ( partyId )
		const messagesInParty = party.getMessagesInParty ( partyId )

		// return which vid selected
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_SELECTED_VIDEO, videoForParty )

		// return to client playerState('playing', 'paused' etc.)
		if ( videoPlayerForParty.timeInVideo !== 0 ) {
			socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_CLIENT_PLAYER_STATE, videoPlayerForParty )
		}

		// Let the client know which other users are currently connected to the party
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_USERS_IN_PARTY, usersInParty )

		// Send all messages that have been posted in the party to the client
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.PARTY_MESSAGE_RECEIVED, messagesInParty )
	}


	//Notify all clients in a party of a newly connected user
	function notifyPartyOfNewlyJoinedUser ( io, partyId, userName ) {
		const usersInParty = party.getUsersForParty ( partyId )
		// Gather all previous messages in party
		// and add a new message someone joined party
		const messagesInParty = party.getMessagesInParty ( partyId )
		// new user joined  party msg
		const userJoinedMessage = messageUtils.generateUserJoinedMessage ( userName, partyId, serverUserName )
		messagesInParty.push ( userJoinedMessage )

		// other users in party
		socketUtils.emitActionToParty ( io, partyId, ACTION_TYPES.SET_USERS_IN_PARTY, usersInParty )

		// re-emmit all messages
		socketUtils.emitActionToParty ( io, partyId, ACTION_TYPES.PARTY_MESSAGE_RECEIVED, messagesInParty )
	}


	//Emit  message to a specific party
	function sendMessageToParty ( io, message, partyId, userName ) {
		// Read all messages in party
		const messagesInCurrentParty = party.getMessagesInParty ( partyId )
		const messageWithUserName = { message, userName, partyId }

		// Add the message to the [messagesInCurrentParty] 
		messagesInCurrentParty.push ( messageWithUserName )

		// Emit all messages in the party to all clients in the party
		socketUtils.emitActionToParty ( io, partyId, ACTION_TYPES.PARTY_MESSAGE_RECEIVED, messagesInCurrentParty )
	}

	


export const party = 
{
partyExists,
getPartyById,
createParty,
getSelectedVideoForParty,
getVideoPlayerForParty,
getUsersForParty,
getMessagesInParty,
sendPartyDetailsToClient,
notifyPartyOfNewlyJoinedUser,
sendMessageToParty,
toggleVideoPlayerInterval,
playVideoForParty,
pauseVideoForParty,
togglePartyWaitingToBeReady,
allUsersReady,
handleUserInPartyNotReady,
handleAllUsersInPartyReady,
onNewPlayerStateForParty
}
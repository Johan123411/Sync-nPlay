import { cache } from './index'
import { party } from "./party"

// Utils & libs
import { socketUtils } from '../utils'

// Constants
import { ACTION_TYPES } from '../core/constants'


	//Retrieve all parties the user is currently a part of
	function getPartyIdForUser ( socketId ) {
		const partyIdsForUser = cache.parties.filter ( ( activeParty ) => {
			return activeParty.usersInParty.find ( ( userId ) => userId === socketId )
		} ).map ( ( activeParty ) => activeParty.partyId )

		return partyIdsForUser && partyIdsForUser.length ? partyIdsForUser[ 0 ] : null
	}


	 //Make socket/user leave all socketIo managed rooms it's a part of

	 function leaveSocketIoRooms( io, socket ) {
		const roomsForSocket = io.sockets.adapter.sids[ socket.id ]
		for ( const room in roomsForSocket ) {
			socket.leave ( room )
		}
	}


	// Remove a user from the party he is in,
	function removeUserFromParties(io, socket ) {
		const socketId = socket.id

		// Make sure the user isn't in any server managed parties anymore
		cache.parties.forEach ( ( activeParty ) => {
			activeParty.usersInParty = activeParty.usersInParty.filter ( ( userId ) => {
				return userId !== socketId
			} )
		} )

		// Disconnect the socket from the parties / rooms managed by socketIo
		user.leaveSocketIoRooms ( io, socket )
	}

	 //1. Removes user from all parties it is in
	 //2. emmit to all clients - user disconnect
	 function disconnectFromParty( io, socket ){
		const userId = socket.id
		const partyIdForUser = user.getPartyIdForUser ( userId )
		user.removeUserFromParties ( io, socket )

		// Notify all users still in the party that this user has left the party
		if ( partyIdForUser ) {
			const usersStillInParty = party.getUsersForParty ( partyIdForUser )
			socketUtils.emitActionToParty ( io, partyIdForUser, ACTION_TYPES.SET_USERS_IN_PARTY, usersStillInParty )
		}
	}

	//Reset the playerState 
	function resetPlayerStateForUser ( socket ) {
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_CLIENT_PLAYER_STATE, {
			playerState: 'paused',
			timeInVideo: 0
		} )
	}


	//Reset the selected video for a user
	function resetSelectedVideoForUser ( socket ) {
		socketUtils.emitActionToClient ( socket, ACTION_TYPES.SET_SELECTED_VIDEO, {
			id: '',
			title: '',
			description: '',
			thumbnailSrc: '',
			videoSource: ''
		} )
	}

	//Reset playerState and the selected video for user
	function resetClientToInitialState( socket ) {
		user.resetPlayerStateForUser ( socket )
		user.resetSelectedVideoForUser ( socket )
	}

	// save/set the videoPlayers state for a user
	// We do this so we know if the user is still buffering a video

	function setUserReadyToPlayState( socketId, newReadyToPlayState ) {
		const userForId = user.getUserForId ( socketId )
		if ( !userForId ) {
			return false
		}

		userForId.readyToPlayState = newReadyToPlayState
	}

	//Returns the user that belongs to the specified socketId
	//( returns undefined if user doesn't exist )
	function getUserForId( socketId ) {
		const newU = cache.users.find ( ( activeUser ) => activeUser.socketId === socketId )
		return newU
	}

	//Returns true if a user with given socketId exists in the activeUsers array
	function userExists( socketId ) {
		return !!user.getUserForId ( socketId )
	}

	//Create new user if user with socketId doesn't exist
	function createNewUser( userId, userName ) {
		if ( !user.userExists ( userId ) ) {
			const newUser = {
				socketId: userId,
				userName,
				readyToPlayState: {
					clientIsReady: false,
					timeInVideo: 0
				}
			}
			
			// let userModel = new usermongo(newUser);
			// userModel.save();
			
			// console.log('Something happened', userModel)
			cache.users.push ( newUser )
		}
	}

	function updateUserNameForUser(userId, userName) {
		if ( user.userExists ( userId ) ) {
			const userForId = user.getUserForId(userId)
			userForId.userName = userName
		}
	}

	//Add a user to a specific party
	function addUserToParty( io, socket, partyId ) {
		const partyForId = party.getPartyById ( partyId )
		const socketId = socket.id

		// user not in other party check
		user.removeUserFromParties ( io, socket )

		// Add users' socketId to the selected party
		partyForId.usersInParty.push ( socketId )

		// Connect the user to the party room through socketIo's native room implementation
		socket.join ( partyId )
	}

	//Returns true is user is authenticated
	function isUserAuthenticated ( socketId ) {
		const userForId = user.getUserForId ( socketId )

		return !!(userForId && userForId.userName)
	}

export const user = {
	setUserReadyToPlayState,
	resetClientToInitialState,
	resetSelectedVideoForUser,
	resetPlayerStateForUser,
	disconnectFromParty,
	removeUserFromParties,
	leaveSocketIoRooms,
	getPartyIdForUser,
	isUserAuthenticated,
	addUserToParty,
	updateUserNameForUser,
	createNewUser,
	userExists,
	getUserForId
}
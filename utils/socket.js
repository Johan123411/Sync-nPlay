export const socketUtils = {
	//Send a message to one specific client/socket
	emitActionToClient: ( socket, actionType, payload ) => {
		socket.emit ( 'action', { type: actionType, payload } )
	},
	//Send message to all clients/sockets in a party
	emitActionToParty: ( io, partyId, actionType, payload ) => {
		io.to ( partyId ).emit ( 'action', { type: actionType, payload } )
	},
	//Send a message to all clients/sockets in a party EXCEPT the sender
	broadcastActionToParty: ( socket, partyId, actionType, payload ) => {
		socket.broadcast.to ( partyId ).emit ( 'action', { type: actionType, payload } )
	}

}
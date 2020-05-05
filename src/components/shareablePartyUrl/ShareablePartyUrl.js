// Libs & utils
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// CSS
import './ShareablePartyUrl.css'

export default class ShareablePartyUrl extends Component {
	static propTypes = {
		partyUrl: PropTypes.string.isRequired,
		router: PropTypes.object.isRequired,
	}

	/**
	 * Navigate to the homepage using react-router
	 */
	navigateToHomePage = () => {
		this.props.router.push ( '/' )
	}

	handleFocus = ( event ) => {
		// we use setSelectionRange() because select() doesn't work on IOS
		event.target.setSelectionRange ( 0, 9999 )
	}

	render () {
		const { partyUrl } = this.props

		return (
			<div className="share-party-url">
				<h2 className="title">Room key:</h2>
				<input type="text"
					   readOnly='readonly'
					   ref={(textarea) => this.textArea = textarea}
					   value={partyUrl}
					   onClick={this.handleFocus}
				/>
				<button className="url-button"><span className="fa fa-share-alt icon-btn"></span>share</button>
				<button className="url-button-secondary" onClick={() => this.copyCodeToClipboard()}>
				<span className="fa fa-clone icon-btn"></span>copy</button>
				<button className="change-movie" onClick={() => this.confrimChange()}><span className="fa fa-film icon-btn"></span>change movie</button>
			</div>
		)
	}
	 
	copyCodeToClipboard = () => {
		const el = this.textArea
		el.select()
		document.execCommand("copy")
	}

	confrimChange = () => {
		var r = window.confirm("Are you sure you want to change the movie?");
		if (r === true) {
			window.location.href="/"
		}
	}
}
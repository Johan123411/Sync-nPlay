// Libs & utils
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// CSS
import './ShareablePartyUrl.css'

export default class ShareablePartyUrl extends Component {
	static propTypes = {
		partyUrl: PropTypes.string.isRequired,
	}

	handleFocus = ( event ) => {
		// we use setSelectionRange() because select() doesn't work on IOS
		event.target.setSelectionRange ( 0, 9999 )
	}

	render () {
		const { partyUrl } = this.props

		return (
			<div className="share-party-url">
				<h2 className="title">Your virtual room URL:</h2>
				<input type="text"
					   readOnly='readonly'
					   ref={(textarea) => this.textArea = textarea}
					   value={partyUrl}
					   onClick={this.handleFocus}
				/>
				<button className="url-button"><span className="fa fa-share-alt icon-btn"></span>Share</button>
				<button className="url-button-secondary" onClick={() => this.copyCodeToClipboard()}>
				<span className="fa fa-clone icon-btn"></span>Copy</button>
				{/* {
            		this.state.copySuccess ?
            		<div style={{"color": "green"}}>
              			Success!
					</div> : null
          		} */}
			</div>
		)
	}

	// constructor(props) {
	// 	super(props)
	 
	// 	this.state = {
	// 	  copySuccess: false
	// 	}
	//   }
	 
	copyCodeToClipboard = () => {
		const el = this.textArea
		el.select()
		document.execCommand("copy")
	}
}
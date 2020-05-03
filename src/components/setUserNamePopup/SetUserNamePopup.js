// Libs & utils
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// CSS
import './SetUserNamePopup.css'

// Assets
import logo from '../../assets/logo-green.svg'

export default class SetUserNamePopup extends Component {
	static propTypes = {
		isVisible: PropTypes.bool.isRequired,
		handleSetUserName: PropTypes.func.isRequired
	}

	render () {
		const { isVisible, handleSetUserName } = this.props

		// Hide the createUserName block if the user is not in the process of creating a username
		const setUserNamePopupCssClasses = classNames ( 'set-username-popup-wrapper', {
			'hidden': !isVisible
		} )

		return (
			<div className={setUserNamePopupCssClasses}>
				<div className="set-username-popup">
					<span className="create-username-header"><img src={logo} className="logo-name-page" alt="Sync n' Play"/></span>
					<span className="create-username-name">Before we begin, please enter your name:</span>

					<div className="username-details">

						<input
							ref={e => this.input = e}
							autoComplete="off"
							className="input user-name"
							maxLength="60"
							placeholder="John Doe"
							tabIndex="0"
							type="text"
						/>
						<div className="create-username button" onClick={() => 
							{
								handleSetUserName ( this.input.value.trim () )
							}}>continue
						</div>
					</div>

					
				</div>
			</div>
		)
	}
}
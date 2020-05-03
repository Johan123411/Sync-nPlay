// Libs & utils
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// CSS
import './PageHeader.css'

export default class PageHeader extends Component {
	static propTypes = {
		titleLeader: PropTypes.string.isRequired,
		titleMain: PropTypes.string,
		titleAfter: PropTypes.string,
	}

	setGreet = () => {
	const date = new Date();
	const hour = date.getHours()
	var greet = "";
	if (hour > 2) {
		greet = "Good Morning";
	}
	if (hour >= 12 && hour < 17) {
		greet = "Good Afternoon";
	}
	else if (hour >= 17) {
		greet = "Good Evening"
	}
	return greet;
	}

	render () {
		const {titleMain, titleAfter} = this.props
		var greeting = this.setGreet()

		return (
			<div className="page-header">
				<div className="g-row">

					<div className="page-header-title">
						<span className="leader">{greeting}</span>
						<span className="title-main">{titleMain}</span>
						{ titleAfter ? <span className="title-after">{titleAfter}</span> : null }
					</div>

				</div>
			</div>
		)
	}
}
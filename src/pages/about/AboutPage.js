// Libs & utils
import React, { Component } from 'react'

// CSS
import './AboutPage.css'

// Assets
import image from '../../assets/about.svg'

class AboutPage extends Component {

	render () {
		return (
			<div className="about-page">
                <div className="g-row">
                    <h1 className="introduction-text"><span className="thin-text">About</span> Us</h1>
                </div>
                
				<div className="g-row content">
                    <div className="left-col">
                        <p>
                            <strong>Sync n' Play</strong> is a website that allows you and your friends 
                            to get together virtually to watch your favourite movies at the same time 
                            in perfect sync. As it syncs the playback across 
                            all the users in the room, if the group needs a quick break to grab popcorn, 
                            everyone's screen will pause and resume at the same time. If you choose to watch 
                            movies alone, with sync n' play you can do that too!
                        </p>
                        <p>
                            You can also find a chatbox where you and your friends can discuss what's going 
                            on in the movie. This group chat allows you to type up your thoughts without having 
                            to reach for another application. Which means that you and your friends can react 
                            and chat in the real time while watching movie.
                        </p>
                    </div>
                    <div className="right-col">
                        <img src={image} className="about-img" alt="Man sitting with laptop"></img>
                    </div>
				</div>
                <div className="g-row">
                    <p className="text-box">
                        Bottom line : <strong>Sync n' Play</strong> helps ease the sudden and sever lack of socialising 
                        we have all had to deal with in this new <i>Coronavirus</i> reality by watching movies 
                        at the same time with a group of friends and family - remotely.
                    </p>
                </div>
			</div>
		)
	}
}


//=====================================
//  CONNECT
//-------------------------------------

export default AboutPage
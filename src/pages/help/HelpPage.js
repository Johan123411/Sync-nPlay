// Libs & utils
import React, { Component } from 'react'

// CSS
import './HelpPage.css'

// Assets
import manSitting from '../../assets/about.svg'
import name from '../../assets/name.gif'
import choose from '../../assets/choose-movie.gif'
import search from '../../assets/search.gif'
import start from '../../assets/start.gif'
import copy from '../../assets/copy.gif'
import playpause from '../../assets/play-pause.gif'
import fullscreen from '../../assets/fullscreen.gif'
import change from '../../assets/change-movie.gif'
import about from '../../assets/about.gif'
import chat from '../../assets/chat.gif'
import help from '../../assets/help.gif'

class AboutPage extends Component {

	render () {
		return (
			<div className="help-page">
                <div className="g-row">
                    <h1 className="introduction-text"><span className="thin-text">How to</span> use</h1>
                </div>
                
				<div className="g-row content">
                    <div className="left-col">
                        <img src={name} className="img" alt="Enter name"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Enter name</span>
                        <p>
                            You will see this screen when you first visit our website. Type in your 
                            name in the text-box and click continue. We will remember your name the 
                            next time you visit. :)
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={choose} className="img" alt="Choose movie"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Choose movie</span>
                        <p>
                            You can browse and select a movie from our recommendations. You can hover 
                            over a movie card to read more about the movie.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={search} className="img" alt="Search movie"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Search movie</span>
                        <p>
                            You can also search for a movie title by clicking on the magnifying glass 
                            or the "search" word in the navigation bar. It will display a text field 
                            where you can enter your search query. You can clear the search field by 
                            clicking on the "x" icon on the right. Hit enter to search the movie.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={start} className="img" alt="Select & start room"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Select & start room</span>
                        <p>
                            After you get the search results, you can click on any of the movie 
                            of your choice and it will start the virtual room.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={copy} className="img" alt="Copy room key"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Copy room key</span>
                        <p>
                            Every virtual room has an unique key. Other users must have this key 
                            so that they can join your virtual room. This key is displayed above the 
                            video player. To copy the key, just click on the "copy" button.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={playpause} className="img" alt="Play & pause movie"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Play & pause movie</span>
                        <p>
                            You can play and pause the movie by clicking on the video player or 
                            by clicking on play/pause icon. You can also mute/unmute the movie by clicking 
                            on the speaker icon.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={fullscreen} className="img" alt="Fullscreen"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Fullscreen</span>
                        <p>
                            You can enter fullscreen mode by clicking on the expand icon. To exit 
                            the fullscreen mode, you can click on the "-" icon located on the bottome 
                            right of your screen.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={chat} className="img" alt="Chatbox"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Chatbox</span>
                        <p>
                            You can access chatbox when you are not in fullscreen mode. You can type 
                            in the text field and press enter or click on "send" button to send your message. 
                            You can also see who has entered in your virtual room in the chatbox.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={change} className="img" alt="Change movie"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Change movie</span>
                        <p>
                            If you wish to change the movie after you have created a room, you can 
                            simply do so by clicking on the "change movie" button. It will ask for your 
                            confirmation and you can click on "ok" if you want to exit the room or 
                            click on "cancel" if you do not want to. The room will continue to exist 
                            even if you created the room and exited.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={about} className="img" alt="About"></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">About us</span>
                        <p>
                            To read what this website is about, click on "about" in the navigation bar.
                        </p>
                    </div>
				</div>

                <div className="g-row content">
                    <div className="left-col">
                        <img src={help} className="img" alt=""></img>
                    </div>
                    <div className="right-col">
                        <span className="help-title">Help</span>
                        <p>
                            If you want to know how to use this website or read this again, you can 
                            click on "help" in the navigation bar.
                        </p>
                    </div>
				</div>

			</div>
		)
	}
}


//=====================================
//  CONNECT
//-------------------------------------

export default AboutPage
---
title: Sync 'n Play
authors: Siddhant Barua, Saishe Sankhe, Maithili Deshmukh 
left-header: Human Computer Interraction 
---

# Running the project locally 
-----------------------------

* First ensure that you have Node installed: 
  https://nodejs.org/en/
* Then ensure you have Ngrok installed, included in the Branch 

* Run the commands: 
    1. npm install 
    2. npm start (deploy the project locally)
    3. configure ngrok (https://ngrok.com/)
    4. open another terminal in the same location and run the command: ./ngrok http 3000 -host-header="localhost:3000"
    5. this serves localhost to public web and illustrates how the website is meant to function in production. 

# Dependencies
---------------- 
* bootstrap
* classnames
* compression
* concurrently
* debug
* express
* font-awesome
* helmet
* lodash
* query-string
* react
* react-bootstrap
* react-dom
* react-facebook
* react-player
* react-redux
* react-router
* react-scripts
* react-share
* react-truncate
* redux
* redux-socket.io
* redux-thunk
* seamless-immutable"
* socket.io
* socket.io-client
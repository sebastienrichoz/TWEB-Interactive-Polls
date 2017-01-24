# AMT project - Gamified app : Interactive polls with Pollak

Pollak is a web application which allows you to create and join polls.
Everyone can ask and answer questions. The creator has the ability to close the room.

**This project has been updated with gamification features**

Server API for gamification: [https://github.com/moodah/AMT_Gamification](https://github.com/moodah/AMT_Gamification)

*Original repo Interactive Polls: [https://github.com/damienrochat/TWEB-Interactive-Polls](https://github.com/damienrochat/TWEB-Interactive-Polls)*

## Preview

[**http://pollak.herokuapp.com**](http://pollak.herokuapp.com) (Basic functionalities for now, just to have an idea about how navigation works and what you can do)

![alt text](https://github.com/damienrochat/TWEB-Interactive-Polls/blob/master/src/public/assets/img/userflow.png "Pollak userflow")

This userflow describes how the application would work.

The frontend application is working but nothing is persisted, because the server development is in progress.

## Technologies and frameworks used

The front-end project was generated with [Angular CLI](https://github.com/angular/angular-cli).
  
This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](http://www.mongodb.com) v3.4): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 2](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): v6.6.0 (with npm v3.10) runtime environment
* [Angular CLI](https://cli.angular.io): project scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Stylish Portfolio](https://startbootstrap.com/template-overviews/stylish-portfolio/): bootstrap template
* [Font Awesome](http://fontawesome.io): icons
* socket.io

## Global architecture

* Users are identified with a unique [UUID](https://www.npmjs.com/package/angular2-uuid) generated in client and stored in localStorage.
* This uuid is set in every header request to identify different users
* A pollroom is identified by a 6 digits random number
* When a user joins a pollroom, the server adds him to the socket room corresponding to the pollroom he joined
* Posting requests like questions, answers, votes, etc. are send on endpoints defined in the API.
* Then the server broadcast the incomed information to every participant of the room with socket io.

## Known issues

* On refresh, the participants are not correctly updated : for the others participant, the number of particpants increase on every page rerefresh
* The creator of the question can answer his question. He shouldn't.
* On server side some verifications are missing like when closing a poll for example
* The room identifier (6 digits number) is pure random.
* App is available only on http, not https.

## Prerequisites

1. Install [Node.js](https://nodejs.org) (min. v 6.6.0) and [MongoDB](http://www.mongodb.com) (min. v 3.2.10)
2. Install Angular CLI: `npm install angular-cli -g`
3. From the root project, install all the dependencies: `npm install`

## Run local

Create a `nodemon.json` file at the root project where you define your environment variables of your system. It will be used by nodemon when the Express server starts.

```json
{
  "env": {
    "MONGODB_URI": "mongodb://192.168.99.100:27017/pollak"
  }
}
```

1. bash 1: `mongod`: run MongoDB server (to use Docker, see the tip bellow)
2. bash 2: `ng build -w`: build the angular 2 project and listens for file changes
3. bash 3: `npm start`: run Express server and serve the app
4. Open [localhost:3000](http://localhost:3000) in your browser

**Tip : MongoDB with Docker**

Run a MongoDB server: `docker run -p 27017:27017 mongo:latest`

Connect to the server with MongoDB client: `docker run -it mongo:latest mongo --host 192.168.99.100` (depending your Docker configuration)

## Deploy on Heroku

Prerequisites : add the remote git configuration with your Heroku app.

Simply push your last commits on Heroku git server. For example :

1. `git push heroku master`
2. The app is available on [http://pollak.herokuapp.com](http://pollak.herokuapp.com) (on your Heroku application)

Heroku will automatically install npm dependencies, build the app under the `dist/` folder and serve it.

## Functionalities

*All question are multiple choice questions.*

**As a user connecting on the landing page**

- Watch some statistics about the app
- Join a pollroom by entering its identifier (like a number of 6 digits)
- Join a previously joined pollroom by selecting it in a list
- Create a poll by entering its name
- Join a created poll by selecting it in a list

Creating or joining any poll makes the user immediately redirecting him to the pollroom

**As a pollroom joiner**

- Watch all questions of the current pollroom
- Watch in-live which questions are answered by other participants
- Watch some stats of the current pollroom
    - identifier of the room
    - number of participants
    - number of questions
    - number of answers
- Watch his current completion of the questions (a progress bar `<nb_question_answered>/<nb_question>`)
- Create question (creating it implies publishing it) with associated responses
- Answer questions once except those created by himself
- Vote questions (like or dislike) except thos created by himself
- (not done) Watch stats summarizing the poll when it closes
- Leave the current pollroom

**As a pollroom creator**

- Same as a pollroom joiner
- Close the poll
- Close a question : a closed question can't be answered anymore

**How a question looks like**

- When the question was created
- Title of question
- multiple choices
- progress bar of answers for each choice (hidden while poll is open)
- number of answer for each choice in brackets
- number of total answers
- Like
- Vote up
- Vote down

**When a pollroom is closed**

- Display all questions, answers and votes
- Questions can't be answered anymore
- Questions can't be created anymore
- Questions can't be voted anymore
- A pollroom can still be joined by entering its identifier
- (not done) Display a graph showing a summary of the poll:
    - graphe one (bar or line chart):
        - axe x: the questions ordered by the most liked to the most disliked
        - axe y: the number of like
    - graphe two (bar chart):
        - axe x : the questions
        - axe y : the participation for the question
        - display the total number of participant as a line in the graph (on axe y)
    - When hovering the graph, show the question with its choices. For each choice, show the number of answer.

## Endpoints (for future release)
See the swagger file in `/doc`

## Authors

Damien Rochat & Sébastien Richoz

Skeleton realised with [Angular 2 Full Stack project](https://david-dm.org/DavideViolante/Angular2-Full-Stack), project where author is [Davide Violante](https://github.com/DavideViolante)

# TWEB project : Interactive polls with Pollak

Pollak is a web application which allows you to :
* As a "teacher", create polls with multiple choice questions, publish them and watch in live the users answer them
* As a "student", join a poll, answer multiple choice questions and watch the results once the question is closed by the "teacher"

## Preview

[**https://pollak.herokuapp.com**](https://pollak.herokuapp.com) (Basic functionalities for now, just to have an idea about how navigation works and what you can do)

![alt text](https://github.com/damienrochat/TWEB-Interactive-Polls/blob/master/src/public/assets/img/userflow.png "Pollak userflow")

This userflow describes how the application would work.

You can now have a deep previous of the different parts of the app with the following links.

* [Dashboard](https://pollak.herokuapp.com/dashboard)
* [Pollcreator](https://pollak.herokuapp.com/pollcreator)
* [Pollroom](https://pollak.herokuapp.com/pollroom)

The frontend application is working but nothing is persisted, because the server development is in progress.

## Technologies and frameworks used

The front-end project was generated with [Angular CLI](https://github.com/angular/angular-cli).
  
This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](http://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 2](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment
* [Angular CLI](https://cli.angular.io): project scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Stylish Portfolio](https://startbootstrap.com/template-overviews/stylish-portfolio/): bootstrap template
* [Font Awesome](http://fontawesome.io): icons
* [ng2d3](https://swimlane.gitbooks.io/ng2d3/content/): angular2 + D3.js framework for charts
* [ng2-toastr](https://www.npmjs.com/package/ng2-toastr): angular2 Toaster
* socket.io (in a future release)

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

## Run the tests

Execute `ng test` to run unit tests with [Karma](https://karma-runner.github.io).

Run the application with `npm start` if it's not already done then execute `ng e2e` to run End-to-End tests with [Protractor](http://www.protractortest.org/). 

## Deploy on Heroku

Prerequisites : add the remote git configuration with your Heroku app.

Simply push your last commits on Heroku git server. For example :

1. `git push heroku master`
2. The app is available on [https://pollak.herokuapp.com](https://pollak.herokuapp.com) (on your Heroku application)

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
- Watch in-live which answers are selected by other joiners
- Watch some stats of the current pollroom
    - identifier of the room
    - number of participants
    - number of questions
    - (optional) the currently most liked question
- Watch his current completion of the questions (a progress bar `<nb_question_answered>/<nb_question>`)
- Create question (creating it implies publishing it) with associated responses
- Answer questions once except those created by himself
- Vote questions (like or dislike) except thos created by himself
- Watch stats summarizing the poll when it closes
- Leave the current pollroom

**As a pollroom creator**

- Same as a pollroom joiner
- Close the poll
- (optionnal) Close a question : a closed question can't be answered anymore

**How a question looks like**

![alt text](https://github.com/damienrochat/TWEB-Interactive-Polls/blob/master/src/public/assets/img/question-look.png "Mockup of a created question in a pollroom")

- When the question was created
- Title of question
- multiple choices
- progress bar of answers for each choice
- number of answer for each choice in brackets
- number of total answers
- Like
- Dislike

**When a pollroom is closed**

- Display all questions, answers and votes
- Questions can't be answered anymore
- Questions can't be created anymore
- Questions can't be voted anymore
- A pollroom can still be joined by entering its identifier
- (optional) Display a graph showing a summary of the poll:
    - graphe one (bar or line chart):
        - axe x: the questions ordered by the most liked to the most disliked
        - axe y: the number of like
    - graphe two (bar chart):
        - axe x : the questions
        - axe y : the participation for the question
        - display the total number of participant as a line in the graph (on axe y)
    - When hovering the graph, show the question with its choices. For each choice, show the number of answer.

## Endpoints (for future release)

**/auth**

- POST : login
- DELETE : logout

**/register**

- POST : create an account

**/rooms**

- POST : create a pollroom
- PATCH : edit a pollroom (close, reopen)

**/rooms/{id}**

- GET : get a pollroom by id (with questions)

**/rooms/{id}/questions**

- POST : create a new question (with possible and corrects answers)
- PATCH : edit a question (close)

**/rooms/{id}/questions/{id}**

- GET : get a question (with possible answers)

Note : be careful to don't leak correct answers

## Authors

Damien Rochat & Sébastien Richoz

Skeleton realised with [Angular 2 Full Stack project](https://david-dm.org/DavideViolante/Angular2-Full-Stack), project where author is [Davide Violante](https://github.com/DavideViolante)

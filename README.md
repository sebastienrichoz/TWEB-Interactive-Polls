# Projet TWEB : Interactive polls

## Fonctionnalités

**En tant qu'utilisateur anonyme**

- Créer un compte (nom d'utilisateur unique et mot de passe avec vérification)
- Se loguer
- Visualiser quelques statistiques globales (nombre de chatrooms, nombre de questions, etc.) sur la page d'accueil pour donner envie
- (Rejoindre une chatroom anonymement)

**En tant qu'utilisateur enregistré**

- Visualiser quelques statistiques personnelles (nombre de chatrooms créées/rejointes, nombre de question posées/répondues, moyenne de participants par chatroom, etc.)
- Créer une chatroom (avec une description, génération automatique de son identifiant)
- Rejoindre une chatroom (avec son identifiant)
- Retrouver son historique de chatroom créées et rejointes
- Entrer dans une chatroom clotûrée à laquelle l'utilisateur a participé
- Se déconnecter
- (Editer/Supprimer son compte)

**En tant que créateur d'une chatroom**

- Affichage de l'identifiant d'accès à la chatroom
- Poser une question à l'audience (question à choix multiples en spécifiant l'énoncé, les réponses possibles et les réponses)
- Clôturer une question
- Clôturer la chatroom
- (Réouvrir une chatroom clôturée)

**En tant qu'auditeur d'une chatroom**

- Visualiser les questions (liste des choix possibles dans un ordre aléatoire)
- Répondre aux questions une seule fois (lié au compte utilisateur)
- Visualiser la correction automatique une fois la question clôturée
- Visualiser quelques statistiques sur les réponses à cette question

## Endpoints

**/auth**

- POST : connexion
- DELETE : déconnexion

**/users**

- POST : création d'un compte

**/chatrooms**

- POST : création d'une chatroom
- PATCH : clôture/réouverture d'une chatroom

**/chatrooms/{id}**

- GET : récupération d'une chatroom (avec questions)

**/chatrooms/{id}/questions**

- POST : création d'une question

**/chatrooms/{id}/questions/{id}**

- GET : récupération d'une question (avec réponses, attention à ce que les utilisateurs ne puisse pas voir les réponses)

**/chatrooms/{id}/question/{id}/answers**

- POST : enregistrement d'une réponse

## Auteurs

Damien Rochat & Sébastien Richoz


## Credentials
Squelette réalisé avec Angular 2 Full Stack project [![Dependencies](https://david-dm.org/DavideViolante/Angular2-Full-Stack.svg)](https://david-dm.org/DavideViolante/Angular2-Full-Stack) [![Donate](https://img.shields.io/badge/paypal-donate-179BD7.svg)](https://www.paypal.me/dviolante) [![MIT license](http://img.shields.io/badge/license-MIT-lightgrey.svg)](http://opensource.org/licenses/MIT)

The front-end of this project was generated with [Angular CLI](https://github.com/angular/angular-cli).

This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](http://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 2](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment
* [Angular CLI](https://cli.angular.io): project scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Font Awesome](http://fontawesome.io): icons

## Prerequisites
1. Install [Node.js](https://nodejs.org) and [MongoDB](http://www.mongodb.com)
2. Install Angular CLI: `npm i angular-cli -g`
3. From project root folder install all the dependencies: `npm i`

## Run
1. Command window 1: `mongod`: run MongoDB
2. Command window 2: `ng build -w`: build the project and keep watching the files for changes
3. Command window 3: `npm start`: run Express server
4. Go to [localhost:3000](http://localhost:3000)

## Production
Run `ng build -prod` to create a production ready bundle.

## Preview
![Preview](https://raw.githubusercontent.com/DavideViolante/Angular2-Full-Stack/master/demo.gif "Preview")

## Please open an issue if
* you have any suggestion or advice to improve this project.
* you noticed any problem or error.

## To do
* tests
* browser autoreload on file changes

## Running unit tests (to do yet)
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests (to do yet)
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Author
* [Davide Violante](https://github.com/DavideViolante)

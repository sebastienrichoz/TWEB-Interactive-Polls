# Projet TWEB : Interactive polls

## Preview
TODO image ou gif

## Prérequis
1. Installer [Node.js](https://nodejs.org) et [MongoDB](http://www.mongodb.com)
2. Installer Angular CLI: `npm i angular-cli -g`
3. Depuis la racine du projet, installer toutes les dépendances: `npm i`

## Exécuter en local
*dans src/server/app.js, décommenter la ligne `mongoose.connect('mongodb://localhost:27017/test');` et commenter la ligne `mongoose.connect(process.env.MONGODB_URI);`*
1. bash 1: `mongod`: lance le serveur MongoDB
2. bash 2: `ng build -w`: compile le projet et se met à l'écoute des changements de fichier
3. bash 3: `npm start`: lance le serveur Express
4. Aller sur [localhost:3000](http://localhost:3000)

## Déployer sur Heroku
Pour le moment c'est moche mais ça marche :

*Installer [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line#download-and-install)*

1. dans src/server/app.js, commenter la ligne `mongoose.connect('mongodb://localhost:27017/test');` et décommenter la ligne `mongoose.connect(process.env.MONGODB_URI);` pour récupérer la config de heroku
2. Compiler le projet `ng build -w`
3. Autoriser le dossier `dist/` dans le .gitignore
4. `git add .`, `git commit -m "<message>"`, `git push heroku master`
5. `heroku open`. L'application est disponible sur [https://interactive-polls.herokuapp.com/](https://interactive-polls.herokuapp.com/)

Une fois l'application déployée, rajouter le dossier `dist/` dans le .gitignore pour ne pas polluer le github

Faudra faire mieux par la suite...

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


## Credentials (David Violante)
Squelette réalisé avec Angular 2 Full Stack project [![Dependencies](https://david-dm.org/DavideViolante/Angular2-Full-Stack.svg)](https://david-dm.org/DavideViolante/Angular2-Full-Stack) [![Donate](https://img.shields.io/badge/paypal-donate-179BD7.svg)](https://www.paypal.me/dviolante) [![MIT license](http://img.shields.io/badge/license-MIT-lightgrey.svg)](http://opensource.org/licenses/MIT)

* Auteur: [Davide Violante](https://github.com/DavideViolante)

The front-end of this project was generated with [Angular CLI](https://github.com/angular/angular-cli).

This project uses the [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)):
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](http://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 2](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment
* [Angular CLI](https://cli.angular.io): project scaffolding
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Font Awesome](http://fontawesome.io): icons

## Production
Run `ng build -prod` to create a production ready bundle.

## Running unit tests (to do yet)
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests (to do yet)
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

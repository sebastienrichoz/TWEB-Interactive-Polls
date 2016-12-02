# Projet TWEB : Interactive polls

## Preview
TODO image ou gif

![alt text](https://github.com/damienrochat/TWEB-Interactive-Polls/blob/master/maquette.jpg "Maquette")

## Technologies, frameworks utilisés
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
* socket.io
* ... TODO

## Prérequis
1. Installer [Node.js](https://nodejs.org) (min. v 6.6.0) et [MongoDB](http://www.mongodb.com) (min. v 3.2.10)
2. Installer Angular CLI: `npm i angular-cli -g`
3. Depuis la racine du projet, installer toutes les dépendances: `npm i`

**Tip : MongoDB à l'aide de Docker**

Lancer un serveur MongoDB: `docker run -p 27017:27017 mongo:latest`

Se connecter au serveur à l'aide du client MongoDB: `docker run -it mongo:latest mongo --host 192.168.99.100` (adresse à adapter selon votre configuration Docker)

## Exécuter en local

Créer un fichier `nodemon.json` à la racine du projet. Celui-ci sera utilsé par nodemon lors du lancement du serveur express.js afin de définir les variables propres à votre système.

```json
{
  "env": {
    "MONGODB_URI": "mongodb://192.168.99.100:27017/interactive-polls"
  }
}
```

1. bash 1: `mongod`: lance le serveur MongoDB
2. bash 2: `ng build -w`: compile le projet en mode production et se met à l'écoute des changements de fichiers
3. bash 3: `npm start`: lance le serveur Express
4. Se rendre à l'adresse [localhost:3000](http://localhost:3000)

## Exécuter les tests

Exécuter `ng test` pour lancer les tests unitaires à l'aide de [Karma](https://karma-runner.github.io).

Lancer l'application avec `npm start` si cela n'est pas déjà fait puis exécuter `ng e2e` pour lancer les tests End-to-End à l'aide de [Protractor](http://www.protractortest.org/). 

## Déployer sur Heroku
Pour le moment c'est moche mais ça marche :

*Installer [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line#download-and-install)*

1. Compiler le projet `ng build --prod` pour créer un bundle de production
2. Autoriser le dossier `dist/` dans le .gitignore
3. `git add .`, `git commit -m "<message>"`, `git push heroku master`
4. `heroku open`. L'application est disponible sur [https://interactive-polls.herokuapp.com/](https://interactive-polls.herokuapp.com/)

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

Squelette réalisé avec [Angular 2 Full Stack project](https://david-dm.org/DavideViolante/Angular2-Full-Stack), projet dont l'auteur est [Davide Violante](https://github.com/DavideViolante)

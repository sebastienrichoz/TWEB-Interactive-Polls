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

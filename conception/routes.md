# Routes Back/Front

## 1. Routes Back-end

| Méthode | Route                                    | Description                                               |
|---------|------------------------------------------|-----------------------------------------------------------|
| POST    | /api/register                            | Inscription d'un nouvel utilisateur.                     |
| POST    | /api/login                               | Connexion d'un utilisateur.                              |
| POST    | /api/logout                              | Déconnexion de l'utilisateur.                            |
| POST    | /api/auth/reset-password                 | Réinitialisation du mot de passe.                        |
| GET     | /api/books/search-books                 | Recherche de livres par critères.                        |
| GET     | /api/books/:bookId                      | Récupérer les détails d'un livre.                        |
| GET     | /api/books/isbn/:isbn                   | Scan de livre par ISBN.                                  |
| PATCH   | /api/books/:bookId/make-available       | Marquer un livre comme disponible.                      |
| GET     | /api/books/available                    | Récupérer les livres disponibles.                        |
| POST    | /api/loans/request                      | Demande de prêt de livre.                                |
| GET     | /api/loans/requests                     | Récupérer les demandes de prêt.                          |
| PUT     | /api/loans/requests/:requestId          | Accepter ou refuser une demande de prêt.                 |
| POST    | /api/books/:bookId/comments             | Ajouter un commentaire à un livre.                      |
| GET     | /api/books/:bookId/comments             | Récupérer les commentaires d'un livre.                  |
| DELETE  | /api/comments/:commentId                | Supprimer un commentaire.                                |
| GET     | /api/comments                           | Récupérer tous les commentaires.                        |
| POST    | /api/contact                            | Envoyer un message via le formulaire de contact.         |
| POST    | /api/library/add                        | Ajouter un livre à la bibliothèque de l'utilisateur.     |
| GET     | /api/library                            | Récupérer la bibliothèque d'un utilisateur.             |
| DELETE  | /api/library/remove                     | Retirer un livre de la bibliothèque de l'utilisateur.   |
| PUT     | /api/library/update-status              | Mettre à jour le statut d'un livre dans la bibliothèque. |
| POST    | /api/messages/:requestId/:recipientId   | Envoyer un message à un utilisateur dans une demande de prêt. |
| GET     | /api/messages/:requestId/:recipientUsername | Récupérer les messages d'une demande de prêt.           |
| GET     | /api/user/profile                       | Récupérer le profil d'un utilisateur.                    |
| PUT     | /api/user/profile                       | Mettre à jour le profil d'un utilisateur.                |
| DELETE  | /api/user/profile                       | Supprimer le compte utilisateur.                        |
| GET     | /api/user/confirm-email                 | Confirmer l'adresse e-mail via un token.                |
| POST    | /api/user/forgot-password               | Demander une réinitialisation du mot de passe.          |
| POST    | /api/user/reset-password                | Réinitialiser le mot de passe.                          |

---

## 2. Routes Front-end

### 1. Authentification et Profil

| Méthode | Route         | Description                           |
|---------|---------------|---------------------------------------|
| GET     | /login        | Page de connexion.                   |
| POST    | /auth/login   | Soumettre le formulaire de connexion.|
| GET     | /register     | Page d'inscription.                  |
| POST    | /auth/register| Soumettre le formulaire d'inscription.|
| GET     | /profile      | Page du profil utilisateur.          |
| PUT     | /profile      | Mise à jour des informations utilisateur. |
| DELETE  | /profile      | Supprimer le compte utilisateur.     |

### 2. Livres et Bibliothèque

| Méthode | Route           | Description                                      |
|---------|-----------------|--------------------------------------------------|
| GET     | /books          | Page listant les livres de la bibliothèque personnelle. |
| GET     | /books/:id/edit | Page de modification d'un livre spécifique.     |
| POST    | /books          | Ajouter un livre dans la bibliothèque via formulaire. |
| PUT     | /books/:id      | Mettre à jour un livre existant.                |
| GET     | /available-books| Page affichant les livres disponibles pour prêt.|
| GET     | /scan           | Page de scan de livre via ISBN.                 |
| GET     | /search         | Page de recherche de livres.                    |

### 3. Commentaires

| Méthode | Route                    | Description                     |
|---------|--------------------------|---------------------------------|
| POST    | /books/:bookId/comments  | Ajouter un commentaire sur un livre. |
| GET     | /books/:bookId/comments  | Afficher les commentaires d'un livre. |
| DELETE  | /comments/:commentId     | Supprimer un commentaire.       |

### 4. Prêts et Messages

| Méthode | Route                             | Description                              |
|---------|-----------------------------------|------------------------------------------|
| POST    | /loans/request                   | Faire une demande de prêt pour un livre. |
| GET     | /loans/requests                  | Page affichant toutes les demandes de prêt. |
| PUT     | /loans/requests/:requestId       | Accepter ou refuser une demande de prêt. |
| POST    | /messages/:requestId/:recipientId| Envoyer un message lié à une demande de prêt. |
| GET     | /messages/:requestId/:recipientUsername | Afficher les messages d'une demande de prêt. |

### 5. Contact

| Méthode | Route    | Description                                  |
|---------|----------|----------------------------------------------|
| POST    | /contact | Envoyer un message via formulaire de contact. |
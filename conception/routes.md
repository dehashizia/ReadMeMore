# Routes Back/Front

## 1. Routes Back-end

| Méthode | Route                       | Description                                       |
|---------|-----------------------------|---------------------------------------------------|
| POST    | `/api/auth/register`        | Inscription d'un nouvel utilisateur.              |
| POST    | `/api/auth/login`           | Connexion d'un utilisateur.                       |
| POST    | `/api/auth/logout`          | Déconnexion de l'utilisateur.                     |
| POST    | `/api/auth/reset-password`  | Réinitialisation du mot de passe.                 |
| GET     | `/api/books`                | Récupération de tous les livres.                  |
| POST    | `/api/books`                | Ajout d'un nouveau livre à la bibliothèque.       |
| PUT     | `/api/books/:id`            | Mise à jour d'un livre existant.                  |
| DELETE  | `/api/books/:id`            | Suppression d'un livre.                           |
| GET     | `/api/users`                | Récupération de tous les utilisateurs (admin).    |
| POST    | `/api/users`                | Ajout d'un nouvel utilisateur (admin).            |
| PUT     | `/api/users/:id`            | Mise à jour d'un utilisateur (admin).             |
| DELETE  | `/api/users/:id`            | Suppression d'un utilisateur (admin).             |

## 2. Routes Front-end

| Méthode | Route                       | Description                                       |
|---------|-----------------------------|---------------------------------------------------|
| GET     | `/register`                 | Page d'inscription.                               |
| POST    | `/register`                 | Soumettre le formulaire d'inscription.            |
| GET     | `/login`                    | Page de connexion.                                |
| POST    | `/login`                    | Soumettre le formulaire de connexion.             |
| GET     | `/books`                    | Page de la bibliothèque personnelle.              |
| POST    | `/books`                    | Soumettre un livre pour l'ajouter à la bibliothèque. |
| GET     | `/books/:id/edit`           | Page de modification d'un livre.                  |
| PUT     | `/books/:id`                | Soumettre les modifications d'un livre.          |
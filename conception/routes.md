# Routes Back/Front

## 1. Routes Back-end

| Méthode | Route                               | Description                                               |
|---------|-------------------------------------|-----------------------------------------------------------|
| POST    | `/api/auth/register`               | Inscription d'un nouvel utilisateur.                      |
| POST    | `/api/auth/login`                  | Connexion d'un utilisateur.                               |
| POST    | `/api/auth/logout`                 | Déconnexion de l'utilisateur.                             |
| POST    | `/api/auth/reset-password`         | Réinitialisation du mot de passe.                         |
| GET     | `/api/books`                       | Récupération de tous les livres.                          |
| POST    | `/api/books`                       | Ajout d'un nouveau livre à la bibliothèque.               |
| PUT     | `/api/books/:id`                   | Mise à jour d'un livre existant.                          |
| DELETE  | `/api/books/:id`                   | Suppression d'un livre.                                   |
| GET     | `/api/users`                       | Récupération de tous les utilisateurs (admin).            |
| POST    | `/api/users`                       | Ajout d'un nouvel utilisateur (admin).                    |
| PUT     | `/api/users/:id`                   | Mise à jour d'un utilisateur (admin).                     |
| DELETE  | `/api/users/:id`                   | Suppression d'un utilisateur (admin).                     |
| GET     | `/api/books/search-books`          | Recherche de livres par critères.                         |
| GET     | `/api/books/:bookId`               | Récupérer les détails d'un livre.                         |
| GET     | `/api/books/isbn/:isbn`            | Scan de livre par ISBN.                                   |
| PATCH   | `/api/books/:bookId/make-available`| Marquer un livre comme disponible.                        |
| GET     | `/api/books/available`             | Récupérer les livres disponibles.                        |
| POST    | `/api/loans/request`               | Demande de prêt de livre.                                 |
| GET     | `/api/loans/requests`              | Récupérer les demandes de prêt.                           |
| PUT     | `/api/loans/requests/:requestId`   | Accepter ou refuser une demande de prêt.                  |
| POST    | `/api/books/:bookId/comments`      | Ajouter un commentaire à un livre.                        |
| GET     | `/api/books/:bookId/comments`      | Récupérer les commentaires d'un livre.                    |
| DELETE  | `/api/comments/:commentId`         | Supprimer un commentaire.                                 |
| GET     | `/api/comments`                    | Récupérer tous les commentaires.                          |
| POST    | `/api/library/add`                 | Ajouter un livre à la bibliothèque de l'utilisateur.      |
| GET     | `/api/library`                     | Récupérer la bibliothèque d'un utilisateur.               |
| DELETE  | `/api/library/remove`              | Retirer un livre de la bibliothèque de l'utilisateur.     |
| PUT     | `/api/library/update-status`       | Mettre à jour le statut d'un livre dans la bibliothèque.  |
| POST    | `/api/user/register`               | Inscription d'un utilisateur.                             |
| POST    | `/api/user/login`                  | Connexion d'un utilisateur.                              |
| GET     | `/api/user/profile`                | Récupérer le profil d'un utilisateur.                     |
| PUT     | `/api/user/profile`                | Mettre à jour le profil d'un utilisateur.                 |
| DELETE  | `/api/user/profile`                | Supprimer le compte utilisateur.                          |
| GET     | `/api/user/confirm-email`          | Confirmer l'adresse e-mail d'un utilisateur via token.   |
| POST    | `/api/user/forgot-password`        | Demander la réinitialisation du mot de passe.             |
| POST    | `/api/user/reset-password`         | Réinitialiser le mot de passe d'un utilisateur.           |

## 2. Routes Front-end

### **1. Authentification et Profil**

| Méthode | Route                      | Description                                          |
|---------|----------------------------|------------------------------------------------------|
| GET     | `/login`                   | Page de connexion.                                   |
| POST    | `/auth/login`              | Soumettre le formulaire de connexion.                |
| GET     | `/register`                | Page d'inscription.                                  |
| POST    | `/auth/register`           | Soumettre le formulaire d'inscription.               |
| GET     | `/profile`                 | Page du profil utilisateur.                          |
| PUT     | `/profile`                 | Mise à jour des informations utilisateur.            |
| DELETE  | `/profile`                 | Supprimer le compte utilisateur.                     |
| GET     | `/confirm-email`           | Confirmation d'adresse e-mail via un token.          |
| POST    | `/auth/reset-password`     | Réinitialiser le mot de passe.                       |
| POST    | `/auth/forgot-password`    | Demander un e-mail pour réinitialiser le mot de passe. |

---

### **2. Livres et Bibliothèque**

| Méthode | Route                        | Description                                          |
|---------|------------------------------|------------------------------------------------------|
| GET     | `/books`                     | Page listant les livres de la bibliothèque personnelle. |
| GET     | `/books/:id/edit`            | Page de modification d'un livre spécifique.          |
| POST    | `/books`                     | Ajouter un livre dans la bibliothèque via formulaire.|
| PUT     | `/books/:id`                 | Mettre à jour un livre existant.                     |
| GET     | `/available-books`           | Page affichant les livres disponibles pour prêt.     |
| GET     | `/scan`                      | Page de scan de livre via ISBN.                      |
| GET     | `/search`                    | Page de recherche de livres.                         |

---

### **3. Commentaires**

| Méthode | Route                                | Description                                          |
|---------|--------------------------------------|------------------------------------------------------|
| POST    | `/books/:bookId/comments`           | Ajouter un commentaire sur un livre.                 |
| GET     | `/books/:bookId/comments`           | Afficher les commentaires d'un livre.                |
| DELETE  | `/comments/:commentId`              | Supprimer un commentaire.                            |

---

### **4. Prêts et Demandes de Prêt**

| Méthode | Route                                  | Description                                          |
|---------|----------------------------------------|------------------------------------------------------|
| POST    | `/loans/request`                      | Faire une demande de prêt pour un livre.             |
| GET     | `/loans/requests`                     | Page affichant toutes les demandes de prêt.          |
| PUT     | `/loans/requests/:requestId`          | Accepter ou refuser une demande de prêt.             |
| GET     | `/loans/requests/:requestId/details`  | Voir les détails d'une demande de prêt.              |

---

### **5. Gestion de la Bibliothèque de l'Utilisateur**

| Méthode | Route                        | Description                                          |
|---------|------------------------------|------------------------------------------------------|
| GET     | `/my-library`                | Afficher la bibliothèque personnelle de l'utilisateur. |
| POST    | `/library/add`               | Ajouter un livre à la bibliothèque de l'utilisateur. |
| DELETE  | `/library/remove`            | Retirer un livre de la bibliothèque de l'utilisateur. |
| PUT     | `/library/update-status`     | Mettre à jour le statut d'un livre dans la bibliothèque de l'utilisateur. |

---

### **6. Autres Routes**

| Méthode | Route                             | Description                                          |
|---------|-----------------------------------|------------------------------------------------------|
| GET     | `/about`                          | Page "À propos" de l'application.                    |
| GET     | `/profile/upload-photo`           | Page pour télécharger une photo de profil.          |
| GET     | `/search-books?query=${query}`    | Recherche de livres en fonction d'un critère donné.  |
| GET     | `/csrf-token`                     | Récupérer un token CSRF pour les requêtes sécurisées. |

---

### **Exemples d'URL avec API_BASE_URL**

- `${API_BASE_URL}/api/reset-password`
- `${API_BASE_URL}/api/upload-profile-photo`
- `${API_BASE_URL}/api/profile`
- `${API_BASE_URL}/api/books/${bookId}/make-available`
- `${API_BASE_URL}/api/books/isbn/${isbn.trim()}`
- `${API_BASE_URL}/api/library/add`
- `${API_BASE_URL}/api/search-books?query=${query}`
- `${API_BASE_URL}/api/csrf-token`
- `${API_BASE_URL}/api/auth/login`
- `${API_BASE_URL}/api/library`
- `${API_BASE_URL}/api/library/remove`
- `${API_BASE_URL}/api/library/update-status`
- `${API_BASE_URL}/api/loans/requests/${requestId}`
- `${API_BASE_URL}/api/loans/requests`
- `${API_BASE_URL}/api/forgot-password`
- `${API_BASE_URL}/api/books/${book_id}`
- `${API_BASE_URL}/api/books/${book_id}/comments`
- `${API_BASE_URL}/api/library/add`
- `${API_BASE_URL}/api/comments/${comment_id}`
- `${API_BASE_URL}/api/books/${book?.book_id}/comments`
- `${API_BASE_URL}/api/confirm-email?token=${token}`
- `${API_BASE_URL}/api/comments`
- `${API_BASE_URL}/api/books/available`
- `${API_BASE_URL}/api/loans/request`
- `${API_BASE_URL}/api/books`
- `${API_BASE_URL}/api/loans`
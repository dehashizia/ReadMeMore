# Dictionnaire des données

| Champ              | Type         | Description                                            |
|--------------------|--------------|--------------------------------------------------------|
| `user_id`          | INTEGER      | Identifiant unique de l'utilisateur (clé primaire).   |
| `username`         | VARCHAR(50)  | Nom d'utilisateur unique.                              |
| `email`            | VARCHAR(100) | Adresse e-mail de l'utilisateur.                       |
| `password_hash`    | VARCHAR(255) | Mot de passe haché de l'utilisateur.                  |
| `book_id`          | INTEGER      | Identifiant unique du livre (clé primaire).           |
| `title`            | VARCHAR(255) | Titre du livre.                                       |
| `author`           | VARCHAR(255) | Auteur du livre.                                      |
| `category`         | VARCHAR(50)  | Catégorie du livre.                                   |
| `status`           | VARCHAR(20)  | Statut du livre (à lire, en cours, lu).              |
| `added_at`         | TIMESTAMP    | Date d'ajout du livre dans la bibliothèque.          |
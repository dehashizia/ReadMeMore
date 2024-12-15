# Modèle Logique de Données (MLD)

## Tables et leurs relations

### 1. Table **User**

- **user_id**: Identifiant unique de chaque utilisateur. (Clé primaire)
- **username**: Nom d’utilisateur unique et obligatoire.
- **email**: Adresse e-mail unique et obligatoire de l’utilisateur.
- **password**: Mot de passe crypté pour l’authentification.
- **emailConfirmed**: Indique si l’adresse e-mail de l’utilisateur a été confirmée (boolean, défaut: false).
- **profile_photo**: URL ou chemin vers la photo de profil de l’utilisateur (nullable).
- **role_id**: Fait référence à l’identifiant de la table `Role` pour définir le rôle de l’utilisateur. (Clé étrangère)

### 2. Table **Role**

- **role_id**: Identifiant unique de chaque rôle. (Clé primaire)
- **role_name**: Nom du rôle (ex. : administrateur, utilisateur).

### 3. Table **Book**

- **book_id**: Identifiant unique de chaque livre. (Clé primaire)
- **title**: Titre du livre.
- **authors**: Tableau de plusieurs auteurs (VARCHAR(255)[]).
- **category_id**: Fait référence à l’identifiant de la table `Category` pour classer le livre. (Clé étrangère)
- **published_date**: Date de publication du livre.
- **description**: Description du livre.
- **isbn**: ISBN pour l'identification unique.
- **page_count**: Nombre total de pages.
- **thumbnail**: URL de la couverture du livre.
- **language**: Langue du livre.
- **barcode**: Code-barre unique pour chaque livre.
- **is_available_for_loan**: Indique si le livre est disponible pour emprunt (boolean, défaut: false).

### 4. Table **Library**

- **library_id**: Identifiant unique pour chaque entrée de la bibliothèque de l’utilisateur. (Clé primaire)
- **user_id**: Fait référence à l’identifiant de la table `User`, indiquant le propriétaire du livre. (Clé étrangère)
- **book_id**: Fait référence à l’identifiant du livre dans la table `Book`. (Clé étrangère)
- **status**: Statut du livre dans la bibliothèque de l’utilisateur (ex. : *to read*, *reading*, *read*).

### 5. Table **Category**

- **category_id**: Identifiant unique de chaque catégorie. (Clé primaire)
- **category_name**: Nom de la catégorie (ex. : Science-fiction, Histoire).

### 6. Table **Comment**

- **comment_id**: Identifiant unique pour chaque commentaire. (Clé primaire)
- **user_id**: Fait référence à l’utilisateur ayant posté le commentaire. (Clé étrangère)
- **book_id**: Fait référence au livre auquel le commentaire est lié. (Clé étrangère)
- **text**: Texte du commentaire.
- **date**: Date à laquelle le commentaire a été posté.
- **rating**: Note attribuée au livre par l’utilisateur (nullable).

### 7. Table **Loan Request**

- **request_id**: Identifiant unique pour chaque demande d’emprunt. (Clé primaire)
- **user_id**: Fait référence à l’utilisateur ayant fait la demande. (Clé étrangère)
- **book_id**: Fait référence au livre concerné par la demande. (Clé étrangère)
- **status**: Statut de la demande (ex. : En attente, Acceptée, Refusée).
- **request_date**: Date et heure de la demande d’emprunt (défaut: CURRENT_TIMESTAMP).

---

## Relations

| Table         | Relation                     | Table Référencée | Cardinalité |
|---------------|------------------------------|-------------------|-------------|
| User          | `role_id` -> `Role.role_id` | Role              | N-1         |
| Library       | `user_id` -> `User.user_id` | User              | N-1         |
| Library       | `book_id` -> `Book.book_id` | Book              | N-1         |
| Book          | `category_id` -> `Category.category_id` | Category | N-1         |
| Comment       | `user_id` -> `User.user_id` | User              | N-1         |
| Comment       | `book_id` -> `Book.book_id` | Book              | N-1         |
| Loan Request  | `user_id` -> `User.user_id` | User              | N-1         |
| Loan Request  | `book_id` -> `Book.book_id` | Book              | N-1         |
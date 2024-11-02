# **Fiche : Comment réaliser un ERD (Entity Relationship Diagram)**

## **Définition**

Un **ERD (Diagramme Entité-Relation)** est un schéma utilisé pour modéliser une base de données en représentant graphiquement les entités (tables), leurs attributs et les relations entre elles. Il permet de visualiser la structure logique d’un système de gestion de bases de données.

---

## **Étapes de réalisation d’un ERD**

### 1. **Identification des entités**

- **Entité** : Un objet ou concept pertinent à modéliser (exemple : un utilisateur, un livre, un commentaire).
- Ce sont souvent des **noms** au singulier (User, Book, Comment).
- Chaque entité correspondra généralement à une table dans la base de données.

### 2. **Définition des attributs**

- Les **attributs** sont les caractéristiques des entités (exemple : un utilisateur peut avoir un nom, un email).
- Un des attributs sera généralement l'**identifiant unique** de l’entité (exemple : `user_id` pour la table User).

### 3. **Identification des relations entre les entités**

- Les **relations** représentent les liens entre différentes entités (exemple : un utilisateur ajoute un livre à sa bibliothèque).
- Les types de relations incluent :
  - **1:N (un à plusieurs)** : Une entité A est liée à plusieurs entités B, mais une entité B est liée à une seule entité A.
  - **N:M (plusieurs à plusieurs)** : Plusieurs entités A sont liées à plusieurs entités B.

### 4. **Détermination des cardinalités**

- La **cardinalité** indique combien d’instances d’une entité peuvent être associées à une autre entité.
- Notation classique :
  - 0,1 : une entité peut être liée à zéro ou une entité.
  - 1,N : une entité est liée à une ou plusieurs entités.
  - 0,N : une entité peut être liée à zéro ou plusieurs entités.

### 5. **Identification des clés primaires et clés étrangères**

- **Clé primaire (Primary Key)** : Un attribut ou un ensemble d’attributs qui identifie de façon unique chaque instance d’une entité (exemple : `user_id`).
- **Clé étrangère (Foreign Key)** : Un attribut dans une entité qui correspond à la clé primaire d’une autre entité, représentant ainsi la relation (exemple : `role_id` dans la table User).

### 6. **Définition des relations N:M avec une table associative**

- Les relations N:M nécessitent une **table associative** (ou table de jointure) qui contiendra des clés étrangères pour chaque entité participant à la relation.

### 7. **Ajout des contraintes**

- Il est important de préciser les **contraintes** (exemple : une contrainte d’unicité, de non-nullité, etc.) pour garantir l’intégrité des données.

---

## **ERD pour le projet *ReadTogether* avec PlantUML**

### **Entités** :

```plantuml
@startuml

skinparam defaultFontName Monospaced
skinparam linetype ortho

entity User {
  user_id   : INTEGER      <<PK, NOT NULL>>
  --
  username  : VARCHAR(50)  <<NOT NULL>>
  email     : VARCHAR(100) <<NOT NULL, UNIQUE>>
  password  : VARCHAR(100) <<NOT NULL>>
  role_id   : INTEGER      <<FK, NOT NULL>>
}

entity Role {
  role_id   : INTEGER      <<PK, NOT NULL>>
  --
  role_name : VARCHAR(20)  <<NOT NULL>>
}

entity Book {
  book_id          : INTEGER      <<PK, NOT NULL>>
  --
  title            : VARCHAR(100) <<NOT NULL>>
  authors          : VARCHAR(255) <<NOT NULL>> -- JSON or comma-separated list
  category_id      : INTEGER      <<FK, NOT NULL>>
  published_date   : DATE
  description      : TEXT
  isbn             : VARCHAR(20)  <<UNIQUE>>
  page_count       : INTEGER
  thumbnail        : VARCHAR(255)
  language         : VARCHAR(10)
  barcode          : VARCHAR(50)  <<UNIQUE>>
}

entity Library {
  library_id : INTEGER      <<PK, NOT NULL>>
  --
  user_id    : INTEGER      <<FK, NOT NULL>>
  book_id    : INTEGER      <<FK, NOT NULL>>
  status     : VARCHAR(10)  <<NOT NULL>> -- Possible values: 'to read', 'reading', 'read'
}

entity Category {
  category_id   : INTEGER      <<PK, NOT NULL>>
  --
  category_name : VARCHAR(50)  <<NOT NULL>>
}

entity Comment {
  comment_id : INTEGER      <<PK, NOT NULL>>
  --
  user_id    : INTEGER      <<FK, NOT NULL>>
  book_id    : INTEGER      <<FK, NOT NULL>>
  text       : TEXT         <<NOT NULL>>
  date       : DATE
}

User ||--o{ Library : "owns books in"
Book ||--o{ Library : "is included in"
User ||--o{ Comment : "writes"
Book ||--o{ Comment : "receives"
Role ||--o{ User : "assigns role"
Category ||--o{ Book : "categorizes"

@enduml

## **Explication du code :**

- Chaque **entité** est représentée par un bloc `entity` avec ses attributs.
- Les **clés primaires** sont identifiées avec `<<PK>>` et les **clés étrangères** avec `<<FK>>`.
- Les **relations** sont représentées par les connecteurs `||--o{`, avec des annotations pour les cardinalités (1, N).
- La table **Library** fait le lien entre **User** et **Book** pour gérer les emprunts, et la table **Comment** pour les avis des utilisateurs.

---

## **Outils pour créer un ERD avec PlantUML :**

- **PlantUML** : Permet de générer des diagrammes à partir d'une description textuelle simple.
- **Visual Studio Code + Extension PlantUML** : Très pratique pour voir le rendu en direct.
- **PlantText** : Un outil en ligne pour écrire et visualiser du code PlantUML.

---

## **Conseils pratiques :**

- **Clarifiez les exigences** : Discutez avec les utilisateurs finaux pour comprendre le domaine métier.
- **Simplifiez les relations** : Utilisez des tables associatives pour les relations complexes.
- **Validez le modèle** : Avant de passer à la phase de développement, validez le modèle avec les parties prenantes.

---

## **Ressources supplémentaires :**

- Tutoriels sur l’utilisation de PlantUML : [PlantUML Documentation](http://plantuml.com/)
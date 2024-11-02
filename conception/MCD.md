# Entities and Attributes

## User

- `user_id` : int [PK]
- `username` : string
- `email` : string
- `password` : string (stored securely)
- `role_id` : int [FK] (reference to Role)

## Role

- `role_id` : int [PK]
- `role_name` : string (e.g., 'user', 'admin')

## Book

- `book_id` : int [PK]
- `title` : string
- `authors` : string[] (tableau de plusieurs auteurs)
- `category_id` : int [FK] (reference to Category)
- `published_date` : date
- `description` : text
- `isbn` : string (unique identifier)
- `page_count` : int
- `thumbnail` : string (URL of the book cover)
- `language` : string
- `barcode` : string (for scanning)

## Library

- `library_id` : int [PK]
- `user_id` : int [FK] (reference to User)
- `book_id` : int [FK] (reference to Book)
- `status` : string (possible values: 'to read', 'reading', 'read')

## Category

- `category_id` : int [PK]
- `category_name` : string

## Comment

- `comment_id` : int [PK]
- `user_id` : int [FK] (reference to User)
- `book_id` : int [FK] (reference to Book)
- `text` : string
- `date` : date

# Relationships

- **User 1 -- N Library** : A user can have multiple books in their library.
- **Book 1 -- N Library** : A book can be present in multiple users' libraries.
- **Book 1 -- N Comment** : A book can have multiple comments.
- **User 1 -- N Comment** : A user can leave multiple comments.
- **Role 1 -- N User** : A role can be associated with multiple users.
- **Category 1 -- N Book** : A category can have multiple books.


USER: user_id, username, email, password, role_id  
ROLE: role_id, role_name  
BOOK: book_id, title, authors, category_id, published_date, description, isbn, page_count, thumbnail, language, barcode  
LIBRARY: library_id, user_id, book_id, status  
CATEGORY: category_id, category_name  
COMMENT: comment_id, user_id, book_id, text, date  

AVOIR, 1N USER, 0N LIBRARY  
EST_PRÉSENT_DANS, 1N BOOK, 0N LIBRARY  
RECEVOIR, 1N BOOK, 0N COMMENT  
ÉCRIRE, 1N USER, 0N COMMENT  
ASSOCIER, 1N ROLE, 0N USER  
GROUPE, 1N CATEGORY, 0N BOOK  
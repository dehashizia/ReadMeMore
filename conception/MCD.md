# Entities and Attributes

## User

- `user_id` : int [PK]
- `username` : string
- `email` : string
- `password` : string (stored securely)
- `emailConfirmed` : boolean (default: false)
- `profile_photo` : string (nullable, default: null)

## Role

- `role_id` : int [PK]
- `role_name` : string (e.g., 'user', 'admin')

## Book

- `book_id` : int [PK]
- `title` : string
- `authors` : string[] (tableau de plusieurs auteurs)
- `published_date` : date
- `description` : text
- `isbn` : string (unique identifier)
- `page_count` : int
- `thumbnail` : string (URL of the book cover)
- `language` : string
- `barcode` : string (for scanning)
- `is_available_for_loan` : boolean (default: false)

## Library

- `library_id` : int [PK]
- `status` : string (possible values: 'to read', 'reading', 'read')

## Category

- `category_id` : int [PK]
- `category_name` : string

## Comment

- `comment_id` : int [PK]
- `text` : string
- `date` : date
- `rating` : int (nullable)

## Loan Request

- `request_id` : int [PK]
- `status` : string (default: 'En attente')
- `request_date` : timestamp (default: CURRENT_TIMESTAMP)

# Relationships

- **User 1 -- N Library** : A user can have multiple books in their library.
- **Book 1 -- N Library** : A book can be present in multiple users' libraries.
- **Book 1 -- N Comment** : A book can have multiple comments.
- **User 1 -- N Comment** : A user can leave multiple comments.
- **Role 1 -- N User** : A role can be associated with multiple users.
- **Category 1 -- N Book** : A category can have multiple books.
- **User 1 -- N Loan Request** : A user can make multiple loan requests.
- **Book 1 -- N Loan Request** : A book can be associated with multiple loan requests.

USER: user_id, username, email, password, emailConfirmed, profile_photo
ROLE: role_id, role_name
BOOK: book_id, title, authors, published_date, description, isbn, page_count, thumbnail, language, barcode, is_available_for_loan
LIBRARY: library_id, status
CATEGORY: category_id, category_name
COMMENT: comment_id, text, date, rating
LOAN_REQUEST: request_id, status, request_date

AVOIR, 1N USER, 0N LIBRARY
EST_PRÉSENT_DANS, 1N BOOK, 0N LIBRARY
RECEVOIR, 1N BOOK, 0N COMMENT
ÉCRIRE, 1N USER, 0N COMMENT
ASSOCIER, 1N ROLE, 0N USER
GROUPE, 1N CATEGORY, 0N BOOK
DEMANDER, 1N USER, 0N LOAN_REQUEST
CONCERNER, 1N BOOK, 0N LOAN_REQUEST
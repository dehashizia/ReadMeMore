CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL,
    category_id INT NOT NULL,
    published_date DATE,
    description TEXT,
    isbn VARCHAR(30) UNIQUE,
    page_count INT,
    thumbnail VARCHAR(255),
    language VARCHAR(10),
    barcode VARCHAR(100) UNIQUE,
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE library (
    library_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status VARCHAR(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id)
);

CREATE TABLE comment (
    comment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    text TEXT NOT NULL,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id)
);
CREATE TABLE loan_request (
  request_id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL,
  user_id INTEGER,
  status VARCHAR(255) DEFAULT 'En attente',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES book(book_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE SET NULL
);
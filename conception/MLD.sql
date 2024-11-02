CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL
);

CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE User (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE TABLE Book (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    authors VARCHAR(255)[] NOT NULL, -- Un tableau pour stocker plusieurs auteurs
    category_id INT NOT NULL,
    published_date DATE,
    description TEXT,
    isbn VARCHAR(20) UNIQUE,
    page_count INT,
    thumbnail VARCHAR(255),
    language VARCHAR(10),
    barcode VARCHAR(50) UNIQUE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE Library (
    library_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status VARCHAR(10) NOT NULL, -- Possible values: 'to read', 'reading', 'read'
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (book_id) REFERENCES Book(book_id)
);

CREATE TABLE Comment (
    comment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    text TEXT NOT NULL,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (book_id) REFERENCES Book(book_id)
);
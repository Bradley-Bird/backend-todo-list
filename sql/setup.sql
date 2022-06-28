-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS todo_users CASCADE;
DROP TABLE IF EXISTS todo CASCADE;

CREATE TABLE todo_users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL
);

CREATE TABLE todo (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    todo VARCHAR NOT NULL, 
    done BOOLEAN NOT NULL, 
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES todo_users(id)
);


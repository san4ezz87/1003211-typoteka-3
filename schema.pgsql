-- DROP DATABASE IF EXISTS typoteka;

-- CREATE DATABASE typoteka
--   WITH
--   OWNER = postgres
--   ENCODING = 'UTF-8'
--   LC_COLLATE = 'C'
--   LC_CTYPE = 'C'
--   TABLESPACE = pg_default
--   TEMPLATE = template0
--   CONNECTION LIMIT = -1;

-- SELECT
--     tablename,
--     indexname,
--     indexdef
-- FROM
--     pg_indexes
-- WHERE
--     schemaname = 'public'
-- ORDER BY
--     tablename,
--     indexname;

DROP TABLE IF EXISTS categories;

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);


DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);


DROP TABLE IF EXISTS articles;

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  announce varchar(500) NOT NULL,
  full_text text NOT NULL,
  picture varchar(50) NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) 
);


DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  atricle_id integer  NOT NULL,
  user_id integer NOT NULL,
  article_id integer NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);


DROP TABLE IF EXISTS article_categories;

CREATE TABLE article_categories(
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX ON articles (title);
-- Все катергории
SELECT * FROM categories;

-- Категории минимум с одной публикацией
SELECT DISTINCT id, name FROM categories 
JOIN article_categories
ON categories.id = article_categories.category_id;

-- Список категорий с количеством публикаций
SELECT
id as category_id,
name as category_name, 
count(categories.id) as articles_amount
FROM categories
JOIN article_categories
ON categories.id = article_categories.category_id
GROUP BY categories.id;

-- Список публикаций
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.created_at,
  STRING_AGG(categories.name, ',') as category_list,
  COUNT(comments.id) AS comments_count,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories
  ON articles.id = article_categories.article_id
  JOIN categories
  ON article_categories.category_id = categories.id
  JOIN comments
  ON comments.article_id = articles.id
  JOIN users
  ON users.id = articles.user_id
  GROUP BY articles.id, users.first_name, users.last_name, users.email
  ORDER BY articles.created_at DESC;

-- Детальная публикации
SELECT
  articles.*,
  STRING_AGG(categories.name, ',') as category_list,
  COUNT(comments.id) AS comments_count,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories
  ON articles.id = article_categories.article_id
  JOIN categories
  ON article_categories.category_id = categories.id
  JOIN comments
  ON comments.article_id = articles.id
  JOIN users
  ON users.id = articles.user_id
  WHERE articles.id = 2
GROUP BY articles.id, users.first_name, users.last_name, users.email

-- 5 последних коментариев
 SELECT
 c.id,
 c.article_id,
 u.first_name,
 u.last_name,
 c.text
 FROM
 comments as c
 JOIN users as u
 ON u.id = c.user_id
 ORDER BY created_at DESC LIMIT 5;


-- коментарий к объявлению
 SELECT
 c.id,
 c.article_id,
 u.first_name,
 u.last_name,
 c.text
 FROM
 comments as c
 JOIN users as u
 ON u.id = user_id
 WHERE c.article_id = 2
 ORDER BY created_at DESC;

-- Обновить заголовок публикации
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;




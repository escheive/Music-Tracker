CREATE VIEW posts_with_likes AS
  SELECT
    posts.*,
    profiles.username,
    (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = posts.id) AS like_count,
    (SELECT COUNT(*) > 0 FROM Likes WHERE Likes.post_id = posts.id AND Likes.user_id = $1) AS user_liked
  FROM
    Posts posts
    LEFT JOIN Profiles profiles ON posts.user_id = profiles.id;


import { useEffect, useState } from 'react';
import { Box, Flex, Text, Avatar } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import { useSupabaseCommentsInfinite } from '@api/supabase/comments';

export const CommentList = ({ post }) => {
  const { data, size, setSize, error: commentsError } = useSupabaseCommentsInfinite(post.id);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true); // Flag to track if all posts are loaded

  // Combine all pages of data into one array
  const comments = data ? data.flat() : [];

  // Load more comments when the last element comes into view
  useEffect(() => {
    if (inView && hasMore && comments && comments.length > 0) {
      setSize(size + 1);
    }
  }, [inView]);

  useEffect(() => {
    // Check if there are no more comments to load
    if (comments && comments[comments.length - 1] && comments[comments.length - 1].length < 10) {
      setHasMore(false);
    }
  }, [comments]);

  if (commentsError) return <Text>Error fetching posts</Text>;

  return (
    <Box mt={4}>
      {comments.map(comment => (
        <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
          <Flex alignItems="center">
            <Avatar size="sm" name={comment.username} src={comment?.avatar_url} mr={3} />
            <Box>
              <Text fontWeight="bold">{comment.Profiles?.username}</Text>
              <Text fontSize="sm" color="gray.500">{new Date(comment.created_at).toLocaleString()}</Text>
            </Box>
          </Flex>
          <Text mt={2}>{comment.content}</Text>
        </Box>
      ))}
      <div ref={ref} />
    </Box>
  )
};

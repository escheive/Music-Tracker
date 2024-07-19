import { Box, Flex, Text, Avatar } from '@chakra-ui/react';

export const CommentList = ({ comments }) => {

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
    </Box>
  )
};

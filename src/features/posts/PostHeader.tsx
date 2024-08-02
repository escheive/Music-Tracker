import { Box, Flex, Text } from '@chakra-ui/react';

export const PostHeader = ({ post }: Record<string, any>) => {
  const postedAt = new Date(post.created_at).toLocaleString();

  return (
    <Box p={4}>
      <Flex mb={2} alignItems='center'>
        <Text fontSize='lg' paddingRight={2} fontWeight='semibold'>{post?.username}</Text>
        <Text fontSize='sm' fontWeight='semibold'>{postedAt}</Text>
      </Flex>
      <Text fontSize='md' fontWeight='semibold'>{post.content}</Text>
    </Box>
  )
}
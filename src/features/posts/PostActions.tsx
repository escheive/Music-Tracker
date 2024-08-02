import { Flex, VStack, Text } from '@chakra-ui/react';
import { ChatIcon, CopyIcon, TriangleUpIcon } from '@chakra-ui/icons';

interface PostActionsProps {
  post: Record<string, any>;
  handleLike: (e: any, postId: any, userLiked: any) => void;
  profile: Record<string, any>;
}

export const PostActions: React.FC<PostActionsProps> = ({ post, handleLike, profile }) => {

  return (
    <Flex py={4} justifyContent='space-around'>
      <VStack 
        alignItems='center'
        color={post.user_liked ? `${profile?.theme}.600` : 'gray.500'}
        _hover={{ 
          color: `${profile?.theme}.600`,
          transform: 'scale(1.1)'
        }}
        onClick={(e) => handleLike(e, post.id, post.user_liked)}
      >
        <TriangleUpIcon />
        <Text>{post?.like_count}</Text>
      </VStack>
      <VStack 
        alignItems='center'
        _hover={{ 
          color: `${profile?.theme}.600`,
          transform: 'scale(1.1)'
        }}
      >
        <ChatIcon />
        <Text>{post?.comment_count}</Text>
      </VStack>
      <VStack 
        alignItems='center'
        _hover={{ 
          color: `${profile?.theme}.600`,
          transform: 'scale(1.1)'
        }}
      >
        <CopyIcon />
        <Text>32</Text>
      </VStack>
    </Flex>
  )
};

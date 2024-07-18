import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Button, Box, Flex, Text, Textarea, Avatar } from '@chakra-ui/react';
import { useSupabaseCommentsInfinite, useSupabaseProfile } from "@api/supabase/fetch/fetch";
import { useAuthContext } from "@context/AuthProvider";
import { Post } from './Post';

// Post Modal Component
export const PostModal = ({ post, setSelectedPost, onClose }) => {
  const { session } = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  // const { getCommentsForPost } = useSupabasePostsInfinite(session?.user.id);
  const { data, size, setSize, addComment, mutate } = useSupabaseCommentsInfinite(post.id);
  // Combine all pages of data into one array
  const comments = data ? data.flat() : [];
  // const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const userId = profile?.id;
    const username = profile?.username;
    if (userId && newComment.trim()) {
      await addComment(userId, username, post.id, newComment);
      setNewComment('');
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size='3xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={4}>
          <Post post={post} setSelectedPost={setSelectedPost} />
          <Box mt={4}>
            <form onSubmit={handleCommentSubmit}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                mb={2}
              />
              <Button type="submit" colorScheme="blue">Post Comment</Button>
            </form>
          </Box>
          <Box mt={4}>
            {comments.map(comment => (
              <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                <Flex alignItems="center">
                  {/* <Avatar size="sm" name={comment.username} src={comment.avatar_url} mr={3} /> */}
                  <Box>
                    <Text fontWeight="bold">{comment.Profiles?.username}</Text>
                    <Text fontSize="sm" color="gray.500">{new Date(comment.created_at).toLocaleString()}</Text>
                  </Box>
                </Flex>
                <Text mt={2}>{comment.content}</Text>
              </Box>
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
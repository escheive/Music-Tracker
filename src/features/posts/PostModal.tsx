import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Box } from '@chakra-ui/react';
import { useSupabaseCommentsInfinite, useSupabaseProfile } from "@api/supabase/fetch/fetch";
import { useAuthContext } from "@context/AuthProvider";
import { Post } from './Post';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

// Post Modal Component
export const PostModal = ({ post, setSelectedPost, onClose }) => {
  const { session } = useAuthContext();
  const { addComment } = useSupabaseCommentsInfinite(post.id);
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const [newComment, setNewComment] = useState('');

  // Submit users comment to db, update cache
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
      <ModalOverlay 
        bg='blackAlpha.400'
        backdropFilter='blur(2px)'
      />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={4}>
          <Post post={post} setSelectedPost={setSelectedPost} />

          <CommentForm 
            handleCommentSubmit={handleCommentSubmit} 
            newComment={newComment} 
            setNewComment={setNewComment}
          />
          
          <Box mt={4}>
            <CommentList 
              post={post} 
            />
          </Box>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
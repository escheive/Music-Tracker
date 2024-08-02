import React from 'react';
import { Box, Textarea, Button } from "@chakra-ui/react";

interface CommentFormProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ newComment, setNewComment, handleCommentSubmit }) => {

  return (
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
  )
};

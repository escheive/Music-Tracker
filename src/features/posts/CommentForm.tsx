import { Box, Textarea, Button } from "@chakra-ui/react";

export const CommentForm = ({ newComment, setNewComment, handleCommentSubmit }) => {

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

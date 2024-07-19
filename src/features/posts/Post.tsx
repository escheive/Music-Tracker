import { Box } from '@chakra-ui/react';
import { useSupabasePostsInfinite, useSupabaseProfile } from "@api/supabase/fetch/fetch";
import { useAuthContext } from "@context/AuthProvider";
import { PostMetadata } from './PostMetadata';
import { PostActions } from './PostActions';
import { PostHeader } from './PostHeader';

export const Post = ({ post, setSelectedPost }) => {
  const { session }  = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const { likePost, unlikePost } = useSupabasePostsInfinite(profile?.id);

  const handleLike = async (e, postId, userLiked) => {
    console.log(e)
    e.stopPropagation();
    if (!userLiked) {
      await likePost(profile?.id, postId)
    } else {
      await unlikePost(profile?.id, postId)
    }
  }

  return (
    <Box 
      key={post.id}
      mb={6} 
      bg='white' 
      boxShadow='md'
      borderRadius='md'
      onClick={() => setSelectedPost(post)}
    >
      <PostHeader post={post} />

      {post.type !== 'general' && <PostMetadata post={post} />}

      <PostActions 
        post={post}
        handleLike={handleLike}
        profile={profile}
      />
    </Box>
  );
};

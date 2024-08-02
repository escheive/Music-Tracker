import { Box } from '@chakra-ui/react';
import { useSupabasePostsInfinite } from '@api/supabase/posts';
import { useSupabaseProfile } from '@api/supabase/profile';
import { useAuthContext } from "@context/AuthProvider";
import { PostMetadata } from './PostMetadata';
import { PostActions } from './PostActions';
import { PostHeader } from './PostHeader';
import { Dispatch, SetStateAction } from 'react';

interface PostProps {
  post: Record<string, any>;
  setSelectedPost: Dispatch<SetStateAction<Record<string, any> | null>>;
}

export const Post: React.FC<PostProps> = ({ post, setSelectedPost }) => {
  const { session }  = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const { likePost, unlikePost } = useSupabasePostsInfinite(profile?.id);

  const handleLike = async (e: { stopPropagation: () => void; }, postId: string, userLiked: boolean) => {
    e.stopPropagation();
    
    if (likePost && unlikePost) {
      if (!userLiked) {
        await likePost(profile?.id, postId)
      } else {
        await unlikePost(profile?.id, postId)
      }
    } else {
      console.error('cannot create post, function error');
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

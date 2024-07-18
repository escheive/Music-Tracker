import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useSupabasePostsInfinite } from "@api/supabase/fetch/fetch";
import { useAuthContext } from "@context/AuthProvider";
import { useInView } from 'react-intersection-observer';
import { Post } from './Post';
import { PostModal } from './PostModal';

// Post List Component
export const PostList = () => {
  const { session } = useAuthContext();
  const [selectedPost, setSelectedPost] = useState(null);
  const { data: posts, setSize, size, error: postsError } = useSupabasePostsInfinite(session?.user.id);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true); // Flag to track if all posts are loaded
  
  // Combine all pages of posts into one array
  const allPosts = posts ? posts.flat() : [];

  // Load more posts when the last element comes into view
  useEffect(() => {
    if (inView && hasMore && posts && posts.length > 0) {
      setSize(size + 1);
    }
  }, [inView]);

  useEffect(() => {
    // Check if there are no more posts to load
    if (posts && posts[posts.length - 1] && posts[posts.length - 1].length < 10) {
      setHasMore(false);
    }
  }, [posts]);

  if (postsError) return <Text>Error fetching posts</Text>;

  return (
    <Box flexDirection='column' width={['100%', '80%']}>

      {allPosts?.map((post) => {

        return (
          <Post 
            key={post.id} 
            post={post} 
            setSelectedPost={() => setSelectedPost(post)}
          />
        )
      })}
      <div ref={ref} />
      {selectedPost && (
        <PostModal post={selectedPost} setSelectedPost={setSelectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </Box>
  );
};
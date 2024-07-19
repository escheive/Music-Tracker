// import supabase from "./supabase";


// export const createPost = async (post: any) => {
//   let { user_id, type, content, metadata } = post;

//   if (type === 'recentlyPlayed') {
//     metadata = simplifySongData(metadata);
//   } else if (type === 'topItems') {
//     metadata = simplifyTopItems(metadata);
//   }

//   const { error } = await supabase
//   .from('Posts')
//   .insert([
//     { 
//       user_id,
//       type,
//       content,
//       metadata,
//     },
//   ])
//   .select()

//   return error;
// }

// export async function createProfile(userId, profile) {
//   const { data, error } = await supabase
//     .from('Profiles')
//     .insert([
//       { 
//         id: userId,
//         username: profile.username,
//         theme: profile.theme
//       }
//     ]);

//   if (error) {
//     console.error('Error creating profile:', error);
//     return null;
//   }
//   return data;
// }   

// export const addLike = async (userId, postId) => {
//   const { data, error } = await supabase
//     .from('Likes')
//     .insert([{ user_id: userId, post_id: postId }]);

//   if (error) {
//     console.error('Error adding like:', error);
//     return null;
//   }

//   return data;
// };
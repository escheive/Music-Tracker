
// Function for creating key for swr fetch posts
export const getKey = (pageIndex: number, previousPageData: any) => {
  // If we reach the end, return null to stop fetching
  if (previousPageData && !previousPageData.length) return null;

  return `posts?is_published=true&page=${pageIndex}`; // SWR key, pageIndex
};
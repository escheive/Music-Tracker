// import React, { useState } from 'react';
// import { searchForTracks } from '@api/spotify';

// const SearchBar = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState(null);

//   const handleSearch = async () => {
//     if (searchQuery.trim() !== '') {
//       const data = await searchForTracks(searchQuery);
//       setSearchResults(data?.tracks?.items || []);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />
//       <button onClick={handleSearch}>Search</button>
//       <ul>
//         {searchResults &&
//           searchResults.map((track) => (
//             <li key={track.id}>{track.name}</li>
//           ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchBar;
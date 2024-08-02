# Spotify Music Tracker

## Overview

**Spotify Music Tracker** is a web application that allows users to track and manage their music listening habits on Spotify. Features include tracking recently played songs, discovering top artists, advanced search for music, and a social media feed to share and view what others are listening to.

## Features

- **Recently Played Songs**: View and manage the songs you've recently played.
- **Top Artists**: Track your most listened-to artists over different periods.
- **Music Recommendations**: Get personalized song and playlist recommendations based on your listening history.
- **Search Functionality**: Search for songs, artists, and playlists within the app.
- **Social Media**: Share your thoughts and music with the world, and comment to interact with others about their music tastes

## Screenshots
<img width="1028" alt="Screenshot 2024-08-02 at 3 20 20 PM" src="https://github.com/user-attachments/assets/a64043be-dea2-445c-9cbe-505d6e12d52c">
<img width="1020" alt="Screenshot 2024-08-02 at 3 21 11 PM" src="https://github.com/user-attachments/assets/c07f29d0-da68-471f-ad63-6eacf903be35">
<img width="1009" alt="Screenshot 2024-08-02 at 3 21 22 PM" src="https://github.com/user-attachments/assets/fdc3fea6-3d32-4a20-bb1f-e3599449238c">
<img width="1031" alt="Screenshot 2024-08-02 at 3 21 39 PM" src="https://github.com/user-attachments/assets/04015a48-01d5-4e79-a33e-9f2e1d93ecb4">
<img width="1018" alt="Screenshot 2024-08-02 at 3 21 49 PM" src="https://github.com/user-attachments/assets/a38dafba-88cf-4af8-ad00-2be803fc12b7">
<img width="1022" alt="Screenshot 2024-08-02 at 3 22 05 PM" src="https://github.com/user-attachments/assets/78648dfe-52ac-43af-b9c5-366338e80c66">
<img width="1009" alt="Screenshot 2024-08-02 at 3 22 23 PM" src="https://github.com/user-attachments/assets/80033fd2-6584-4c47-a7d0-e55ca3902e62">
<img width="1034" alt="Screenshot 2024-08-02 at 3 23 23 PM" src="https://github.com/user-attachments/assets/86597adf-c331-46cd-b957-49e790b945fe">
<img width="1028" alt="Screenshot 2024-08-02 at 3 23 38 PM" src="https://github.com/user-attachments/assets/2152e857-1735-4b4f-a520-fb3017bba35a">



## Live Demo

You can try out the live version of the app [here](https://mymusictracker.vercel.app/).

## Installation

To get started with the app locally, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- npm or Yarn
- Spotify Developer Account (for API access)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/spotify-music-tracker.git
   cd spotify-music-tracker
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add your Spotify API credentials:

   ```env
  VITE_CLIENT_ID
  CLIENT_SECRET
  VITE_REDIRECT_URI
  VITE_CLIENT_REDIRECT_URI
  VITE_SUPABASE_URL
  VITE_SUPABASE_KEY
   ```

4. **Run the Development Server**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open Your Browser**

   Go to `http://localhost:3000` to see the app in action.

## Usage

1. **Authenticate with Spotify**

   Log in using your Spotify account to access personalized features.

2. **Track Recently Played Songs**

   Navigate to the Recently Played section to see your recent tracks.

3. **Discover Top Artists**

   Explore your top artists and see statistics about your listening habits.

4. **Get Recommendations**

   Use the recommendation feature to find new songs and playlists based on your listening history.

## Contributing

Contributions are welcome! If you’d like to contribute to the project, please follow these guidelines:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add a descriptive message"
   ```

4. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature
   ```

5. **Create a Pull Request**

   Submit a pull request from your feature branch to the `main` branch of the original repository.

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## Acknowledgements

- [Spotify API](https://developer.spotify.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Supabase](https://supabase.com/)

## Contact

For questions or feedback, please contact [erik.softwaredevelopment@gmail.com](mailto:erik.softwaredevelopment@gmail.com).

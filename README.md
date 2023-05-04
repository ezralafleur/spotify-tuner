# Spotify Tuner

Spotify Tuner is a web app built on Next.js that allows users to get song recommendations based on specific genres and song characteristics (e.g. popularity, loudness, danceability).

It uses the Spotify API to get recommendations but does not require the user to have a Spotify account.

## Usage

To use Spotify Tuner, navigate to [spotify-tuner.vercel.app](https://spotify-tuner.vercel.app) in your web browser.

## Key Features

- Ability to adjust characteristics such as tempo, energy, and valence to get customized song recommendations
- Can select up to five genres from which to build recommendations
- Provides song recommendations even without a Spotify account

## Technologies Used

- React
- Next.js
- DaisyUI + Tailwind

## Local Setup

To build the app locally, you will need to have Node.js and npm installed on your machine. 

### Step 1: Clone the repository and install dependencies.

```
git clone https://github.com/ezralafleur/spotify-tuner.git
cd spotify-tuner
npm install
```

### Step 2: Create and populate `.env.local`

Add a `.env.local` file in the root directory of the project and populate with the following environment variables:

```
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with your own Spotify API client ID and secret key. You can obtain these by creating a new Spotify App in the Spotify Developer Dashboard.

### Step 3: Start the development server

`npm run dev`

## Future development plans

- Get recommendations based on songs and artists instead of just genres
- Create and save personal playlists
- Social sharing

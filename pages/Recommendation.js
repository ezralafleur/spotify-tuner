import Image from "next/image";

export default function Recommendation({ track }) {
  const isServer = () => typeof window === `undefined`;
  let title, artists, image, link, features;

  if (!isServer()) {
    title = track.name;
    artists = track.artists;
    image = track.album.images[0];
    link = "http://open.spotify.com/track/" + track.id;
    features = track.features;
  }

  const displayFeatures = [
    "acousticness",
    "danceability",
    "energy",
    "instrumentalness",
    "liveness",
    "loudness",
    "popularity",
    "speechiness",
    "tempo",
    "valence",
  ];

  return isServer() ? null : (
    <div className="inline-block card card-compact shadow-xl m-5 justify-self-center w-[275px] align-top max-w-[275px]">
      <figure className="relative">
        <div className="absolute pl-3 pt-3 inset-y-0 w-full opacity-0 bg-white/90 hover:opacity-100">
          {Object.keys(features).map((key, index) => {
            return displayFeatures.includes(key) ? (
              <div key={index} className="text-sm">
                <span className="capitalize font-semibold">{key}: </span>
                <span className="font-light">{features[key]}</span>
              </div>
            ) : (
              ""
            );
          })}
        </div>
        <Image
          src={image.url}
          alt="album art"
          height={image.height}
          width={image.width}
          unoptimized={true}
        ></Image>
      </figure>
      <div className="card-body">
        <span className="card-title songTitle">{title}</span>
        <br />
        {artists.map((artist, index) => {
          return (
            <span key={index} className="artistName">
              {artist.name}
            </span>
          );
        })}
      </div>
      <div className="card-actions mt-7">
        <a
          className="btn primary-btn btn-sm w-full absolute bottom-0"
          href={link}
          target="_blank"
        >
          Open in Spotify
        </a>
      </div>
    </div>
  );
}

import Image from "next/image";

export default function Recommendation({ title, artists, link, image }) {
  const isServer = () => typeof window === `undefined`;

  return isServer() ? null : (
    <div className="card card-compact shadow-xl inline-block m-3 max-w-[275px]">
      <figure>
        <Image
          src={image.url}
          alt="album art"
          height={image.height}
          width={image.width}
        ></Image>
      </figure>
      <div className="card-body">
        <span className="card-title songTitle">{title}</span>
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

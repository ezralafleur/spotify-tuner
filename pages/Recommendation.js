import Image from "next/image";

export default function Recommendation({ title, artists, link, image }) {
  return (
    <div className="card card-compact shadow-xl recommendation">
      <figure>
        <Image
          src={image.url}
          alt="album art"
          height={image.height}
          width={image.width}
        ></Image>
      </figure>
      <div className="card-body">
        <a href={link} className="card-title songTitle">
          {title}
        </a>
        {artists.map((artist, index) => {
          return (
            <span key={index} className="artistName">
              {artist.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

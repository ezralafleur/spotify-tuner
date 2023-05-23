import React, { useState } from "react";
import Head from "next/head";
import Genre from "./Genre";
import Recommendation from "./Recommendation";
import Attribute from "./Attribute";

export default function Home({ auth_token, initialGenres }) {
  const [recommendations, setRecommendations] = useState([]);
  const [genres, setGenres] = useState(initialGenres);
  const [upToDate, setUpToDate] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [attributes, setAttributes] = useState([
    {
      name: "acousticness",
      label: "Acousticness",
      description:
        "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
    {
      name: "danceability",
      label: "Danceability",
      description:
        "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
    {
      name: "energy",
      label: "Energy",
      description:
        "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
    {
      name: "instrumentalness",
      label: "Instrumentalness",
      description:
        'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
    {
      name: "liveness",
      label: "Liveness",
      description:
        "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
    {
      name: "loudness",
      label: "Loudness",
      description:
        "The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.",
      min: -60,
      max: 0,
      value: -60,
      active: false,
    },
    {
      name: "popularity",
      label: "Popularity",
      description:
        "The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.",
      min: 0,
      max: 100,
      value: 0,
      active: false,
    },
    {
      name: "speechiness",
      label: "Speechiness",
      description:
        "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
    {
      name: "tempo",
      label: "Tempo",
      description:
        "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.",
      min: 0,
      max: 250,
      value: 0,
      active: false,
    },
    {
      name: "valence",
      label: "Valence",
      description:
        "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
      min: 0,
      max: 1,
      value: 0,
      active: false,
    },
  ]);

  function handleAttributeChange(attributeName, newValue) {
    setUpToDate(false);
    setErrorMessage("");
    let newAttributes = attributes.map((attribute) => {
      if (attribute.name == attributeName) {
        attribute.active = true;
        attribute.value = newValue;
      }
      return attribute;
    });

    setAttributes([...newAttributes]);
  }

  function resetAttributes() {
    setUpToDate(false);
    setAttributes(
      attributes.map((attribute) => {
        attribute.active = false;
        attribute.value = attribute.min;
        return attribute;
      })
    );
  }

  function getActiveAttributes() {
    return attributes.filter((attribute) => attribute.active);
  }

  function setActivation(attributeName, isChecked) {
    setUpToDate(false);
    let newAttributes = attributes.map((attribute) => {
      if (attribute.name == attributeName) {
        attribute.active = isChecked;
      }
      return attribute;
    });

    setAttributes([...newAttributes]);
  }

  function getRecommendations() {
    if (getActiveGenres().length < 1) {
      setErrorMessage("You must select at least one genre");
      return;
    }
    setUpToDate(true);

    let activeAttributes = attributes.filter((attribute) => attribute.active);

    let genreSelection = getActiveGenres().map((genre) => {
      return genre.name;
    });

    setIsLoading(true);

    fetch("api/recommendations", {
      method: "POST",
      body: JSON.stringify({
        genres: genreSelection,
        attributes: activeAttributes,
      }),
      headers: { token: auth_token },
    })
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((json) => setRecommendations(json));
  }

  function getActiveGenres() {
    return genres.filter((genre) => genre.active);
  }

  function atMaxGenres() {
    return getActiveGenres().length >= 5;
  }

  function clearGenres() {
    setUpToDate(false);
    setGenres(
      genres.map((genre) => {
        genre.active = false;
        return genre;
      })
    );
  }

  function toggleGenre(genreName) {
    setErrorMessage("");
    let newGenres = genres.map((genre) => {
      if (genre.name == genreName) {
        if (!atMaxGenres() || genre.active) {
          setUpToDate(false);
          genre.active = !genre.active;
        }
      }
      return genre;
    });

    setGenres(newGenres);
  }

  return (
    <>
      <script
        data-goatcounter="https://ezralafleur.goatcounter.com/count"
        async
        src="//gc.zgo.at/count.js"
      ></script>
      <div
        id="appBody"
        data-theme="lofi"
        className="grid grid-cols-1 lg:grid-cols-5"
      >
        <Head>
          <title>Spotify Tuner</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/icons/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/icons/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff"></meta>
        </Head>
        {errorMessage ? (
          <div class="toast toast-top toast-center z-20">
            <div class="alert alert-error">
              <div>
                <span>{errorMessage}</span>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          id="sidebar"
          className="sticky -top-20 col-span-1 bg-white/80 z-10"
        >
          <div className="mt-5 lg:mt-8">
            <h1 className="text-4xl text-center font-semibold">
              Spotify Tuner
            </h1>
          </div>
          <ul
            id="steps"
            className="steps sticky top-0 m-5 lg:mt-10 lg:ml-10 lg:steps-vertical w-full"
          >
            <li
              className={
                getActiveGenres().length > 0 ? "step step-primary" : "step"
              }
              href="#genreContainer"
            >
              <a href="#genreContainer">Select Genres</a>
            </li>
            <li
              className={
                getActiveAttributes().length > 0 || upToDate
                  ? "step step-primary"
                  : "step"
              }
            >
              <a href="#attributeContainer">Adjust Attributes</a>
            </li>

            <li
              className={
                upToDate
                  ? "step break-after-column step-primary"
                  : "step break-after-column"
              }
            >
              <a href="#recommendationsContainer">Get Results</a>
            </li>
          </ul>
        </div>
        <div
          id="actionContainer"
          className="flex flex-col items-center col-span-4 mx-7 mt-5 lg:mt-10"
        >
          <div id="genreContainer" className="border rounded p-5 w-full">
            <h2 className="text-2xl font-bold">Select Genres</h2>
            <h3 className="text-md font-extralight">
              You must select at least one genre and may select up to five
            </h3>
            <br />
            {genres.map((genre, index) => {
              return (
                <Genre
                  key={index}
                  name={genre.name}
                  isActive={genre.active}
                  disabled={atMaxGenres() && !genre.active}
                  onClick={() => toggleGenre(genre.name)}
                ></Genre>
              );
            })}
            <br />
            <br />
            <button className="btn btn-sm ml-2" onClick={clearGenres}>
              Clear All
            </button>
          </div>
          <div
            id="attributeContainer"
            className="border rounded m-1 md:m-10 p-5 w-full"
          >
            <div className="inline-block  grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2 lg:col-span-3">
                <h2 className="text-2xl font-bold">Adjust Attributes</h2>
                <h3 className="text-md font-extralight">
                  Optionally, use attributes to further dial in recommendations
                </h3>
              </div>
              {attributes.map((attribute, index) => {
                return (
                  <Attribute
                    key={index}
                    name={attribute.name}
                    description={attribute.description}
                    label={attribute.label}
                    active={attribute.active}
                    value={attribute.value}
                    min={attribute.min}
                    max={attribute.max}
                    setActivation={setActivation}
                    handleAttributeChange={handleAttributeChange}
                  ></Attribute>
                );
              })}
            </div>
            <br />
            <button className="btn btn-sm ml-2" onClick={resetAttributes}>
              Reset
            </button>
          </div>
          <button
            id="recommendationsButton"
            onClick={getRecommendations}
            className={"btn btn-lg my-10 " + (isLoading ? "loading" : "")}
            disabled={isLoading}
          >
            Get Recommendations
          </button>
          <div
            id="recommendationsContainer"
            className="justify-center w-full self-center"
          >
            {recommendations.map((song, index) => {
              return <Recommendation key={index} track={song}></Recommendation>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  const auth_key = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString(
    "base64"
  );

  const auth_response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    timeout: 5000,
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    headers: {
      Authorization: "Basic " + auth_key,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });

  let auth_token = await auth_response.access_token;

  const GENRE_ENDPOINT =
    "https://api.spotify.com/v1/recommendations/available-genre-seeds";

  const auth_header = { Authorization: "Bearer " + auth_token };

  const genreNames = await fetch(GENRE_ENDPOINT, { headers: auth_header })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json.genres;
    })
    .catch((error) => {
      console.log(error);
    });

  const initialGenres = genreNames.map((genreName) => {
    let genre = {};
    genre.name = genreName;
    genre.active = false;
    return genre;
  });

  return { props: { auth_token, initialGenres } };
}

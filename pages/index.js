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

  const [attributes, setAttributes] = useState([
    { name: "acousticness", min: 0, max: 1, value: 0, active: false },
    { name: "danceability", min: 0, max: 1, value: 0, active: false },
    { name: "energy", min: 0, max: 1, value: 0, active: false },
    { name: "instrumentalness", min: 0, max: 1, value: 0, active: false },
    { name: "liveness", min: 0, max: 1, value: 0, active: false },
    { name: "loudness", min: 0, max: 1, value: 0, active: false },
    { name: "popularity", min: 0, max: 100, value: 0, active: false },
    { name: "speechiness", min: 0, max: 1, value: 0, active: false },
    { name: "tempo", min: 0, max: 300, value: 0, active: false },
    { name: "valence", min: 0, max: 1, value: 0, active: false },
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

    console.log("genres: " + genreSelection.toString());
    console.log("attributes: " + activeAttributes.toString());

    fetch("api/recommendations", {
      method: "POST",
      body: JSON.stringify({
        genres: genreSelection,
        attributes: activeAttributes,
      }),
      headers: { token: auth_token },
    })
      .then((response) => {
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
    <div
      id="appBody"
      data-theme="lofi"
      className="grid grid-cols-1 lg:grid-cols-5"
    >
      <Head>
        <title>Spotify Tuner</title>
      </Head>
      {errorMessage ? (
        <div class="toast toast-top toast-center z-10">
          <div class="alert alert-error">
            <div>
              <span>{errorMessage}</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div id="sidebar" className="col-span-1">
        <div className="mt-5 lg:mt-8">
          <h1 className="text-4xl text-center lg:text-5xl">Spotify Tuner</h1>
        </div>
        <ul
          id="steps"
          className="steps sticky  top-0 m-5 lg:mt-10 lg:ml-10 lg:steps-vertical w-full"
        >
          <li
            className={
              getActiveGenres().length > 0 ? "step step-primary" : "step"
            }
          >
            Select Genres
          </li>
          <li
            className={
              getActiveAttributes().length > 0 || upToDate
                ? "step step-primary"
                : "step"
            }
          >
            Adjust Attributes
          </li>
          <li
            className={
              upToDate
                ? "step break-after-column step-primary"
                : "step break-after-column"
            }
          >
            Get Results
          </li>
        </ul>
      </div>
      <div
        id="actionContainer"
        className="flex flex-col items-center col-span-4 ml-5 mt-5 lg:mt-10"
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
        </div>
        <div
          id="attributeContainer"
          className="border rounded inline-block m-1 md:m-10 p-5 grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
        >
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
        <button
          id="recommendationsButton"
          onClick={getRecommendations}
          className="btn btn-lg mt-3"
        >
          Get Recommendations
        </button>
        <div id="recommendationsContainer" className="m-10 p-5">
          {recommendations.map((song, index) => {
            return (
              <Recommendation
                key={index}
                title={song.name}
                artists={song.artists}
                image={song.album.images[0]}
                link={"http://open.spotify.com/track/" + song.id}
              >
                {JSON.stringify(song)}
              </Recommendation>
            );
          })}
        </div>
      </div>
    </div>
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
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    headers: {
      Authorization: "Basic " + auth_key,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((response) => {
    return response.json();
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
    });

  const initialGenres = genreNames.map((genreName) => {
    let genre = {};
    genre.name = genreName;
    genre.active = false;
    return genre;
  });

  return { props: { auth_token, initialGenres } };
}

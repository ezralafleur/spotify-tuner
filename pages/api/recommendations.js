export default function handler(req, res) {
  const RECOMMENDATIONS_ENDPOINT = "https://api.spotify.com/v1/recommendations";
  const FEATURES_ENDPOINT = "https://api.spotify.com/v1/audio-features";

  const AUTH_HEADER = { Authorization: "Bearer " + req.headers.token };

  const genres = JSON.parse(req.body).genres;

  const attributes = JSON.parse(req.body).attributes;
  const attribute_params = attributes
    .map((attribute) => {
      return "target_" + attribute.name + "=" + attribute.value;
    })
    .join("&");

  const recommendations_url =
    RECOMMENDATIONS_ENDPOINT +
    "?seed_genres=" +
    genres.slice(0, 5).join(",") +
    "&" +
    attribute_params;

  fetch(recommendations_url, { headers: AUTH_HEADER })
    .then((response) => {
      console.log("getting data from " + recommendations_url);
      return response.json();
    })
    .then((recommendations) => {
      recommendations = recommendations.tracks;
      let recommendationsMap = new Map();
      for (let recommendation of recommendations) {
        recommendationsMap.set(recommendation.id, recommendation);
      }
      const features_url =
        FEATURES_ENDPOINT +
        "?ids=" +
        recommendations.map((track) => track.id).join(",");

      fetch(features_url, { headers: AUTH_HEADER })
        .then((response) => {
          console.log("getting attributes from " + features_url);
          return response.json();
        })
        .then((features) => {
          features = features.audio_features;
          for (let feature of features) {
            let track = recommendationsMap.get(feature.id);
            track["features"] = feature;
            recommendationsMap.set(feature.id, track);
          }

          return res.status(200).json(Array.from(recommendationsMap.values()));
        });
    });
}

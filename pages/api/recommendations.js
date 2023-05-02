export default function handler(req, res) {
  const RECOMMENDATIONS_ENDPOINT = "https://api.spotify.com/v1/recommendations";
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
    "&";
  attribute_params;

  fetch(recommendations_url, { headers: AUTH_HEADER })
    .then((response) => {
      return response.json();
    })
    .then((recommendations) => {
      res.status(200).json(recommendations.tracks);
    });
}

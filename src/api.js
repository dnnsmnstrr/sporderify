var SpotifyWebApi = require('spotify-web-api-node');
const {SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret, REDIRECT_URI: redirectUri} = process.env
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri
});

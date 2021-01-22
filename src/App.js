import React from 'react'
import { SpotifyApiContext } from 'react-spotify-api'
import Cookies from 'js-cookie'

import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

import {Playlists} from './Playlist'

const {REACT_APP_CLIENT_ID = ''} = process.env

const App = () => {
  const token = Cookies.get('spotifyAuthToken')
  console.log('REACT_APP_CLIENT_ID', REACT_APP_CLIENT_ID)
  return (
    <div className='app'>
      {token ? (
        <SpotifyApiContext.Provider value={token}>
          <p>You are authorized with token: {token}</p>
          <Playlists />
        </SpotifyApiContext.Provider>
      ) : (
        // Display the login page
        <SpotifyAuth
          redirectUri='http://localhost:3000/callback'
          clientID={REACT_APP_CLIENT_ID}
          scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]} // either style will work
        />
      )}
    </div>
  )
}
export default App

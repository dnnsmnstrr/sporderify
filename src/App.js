import React, { useState, useEffect } from 'react'
import { SpotifyApiContext } from 'react-spotify-api'
import Cookies from 'js-cookie'

import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

import {Playlists} from './components/Playlists'

const {REACT_APP_CLIENT_ID = ''} = process.env

const App = () => {
  const [token, setToken] = useState("")
  useEffect(() => {
    setToken(Cookies.get('spotifyAuthToken'))
  }, [])
  return (
    <div className='app'>
      {token ? (
        <SpotifyApiContext.Provider value={token}>
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

import React, { useState, useEffect } from 'react'
import { SpotifyApiContext } from 'react-spotify-api'
import Cookies from 'js-cookie'

import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

import {Playlists} from './components/Playlists'

const {REACT_APP_CLIENT_ID = '', REACT_APP_CALLBACK = ''} = process.env

const App = () => {
  const [token, setToken] = useState("")
  useEffect(() => {
    setToken(Cookies.get('spotifyAuthToken'))
  }, [])
  return (
    <div className='app'>
      {token ? (
        <SpotifyApiContext.Provider value={token}>
          <Playlists token={token} />
        </SpotifyApiContext.Provider>
      ) : (
        // Display the login page
        <SpotifyAuth
          redirectUri={REACT_APP_CALLBACK}
          clientID={REACT_APP_CLIENT_ID}
          scopes={[Scopes.all]}
        />
      )}
    </div>
  )
}
export default App

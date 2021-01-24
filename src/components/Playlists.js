import React, {useState, useEffect} from 'react'
import { UserPlaylists, Playlist } from 'react-spotify-api'
import {
  Grid
} from '@material-ui/core'
import Toolbar from './Toolbar'
import {sortByChars} from '../api'
import Spotify from 'spotify-web-api-js'
const Playlists = ({token}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('')

  const spotifyApi = new Spotify()
  spotifyApi.setAccessToken(token)

  useEffect(() => {
    spotifyApi.skipToNext()
  }, [])
  const reorderPlaylist = async () => {
    spotifyApi.reorderTracksInPlaylist(selectedPlaylist.id, 1, 0)
  }
  useEffect(() => console.log('selectedPlaylist', selectedPlaylist), [selectedPlaylist])

  return (
    <Grid container>
      <Toolbar onSort={() => reorderPlaylist()}/>
      <Grid item xs='6'>
        <UserPlaylists>
          {(playlists, loading, error) =>{
              return playlists && playlists.data ? (
                  playlists.data.items.map(playlist => (
                      <h1 onClick={() => setSelectedPlaylist(playlist)}key={playlist.id}>{playlist.name}</h1>
                  ))
              ) : null}
          }
        </UserPlaylists>
      </Grid>
      <Grid item xs='6'>
        {selectedPlaylist ? <Playlist id={selectedPlaylist.id}>
          {(playlist, loading, error) => {
            console.log('playlist', playlist)
            if (playlist.data && playlist.data.tracks.items) {
              return playlist.data.tracks.items.map(track => (
                <h1 key={track.track.id}>{track.track.name}</h1>
            ))
            }
            return playlist && playlist.name ? <h1>{playlist.name}</h1> : null
          }}
        </Playlist> : 'Select a Playlist'}
      </Grid>
    </Grid>
  )
}

export {Playlists}

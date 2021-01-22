import React, {useState, useEffect} from 'react'
import { UserPlaylists, Playlist } from 'react-spotify-api'
import {
  Grid
} from '@material-ui/core'
const Playlists = (props) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  useEffect(() => console.log('selectedPlaylist', selectedPlaylist), [selectedPlaylist])
  return (
    <Grid container>
      <Grid item>
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
      <Grid item>
        <Playlist id={selectedPlaylist.id}>
          {(playlist, loading, error) => {
            console.log('playlist', playlist)
            if (playlist.data.tracks.items) {
              return playlist.data.tracks.items.map(track => (
                <h1 key={track.track.id}>{track.track.name}</h1>
            ))
            }
            return playlist ? <h1>{playlist.name}</h1> : null
          }}
        </Playlist>
      </Grid>
    </Grid>
  )
}

export {Playlists}

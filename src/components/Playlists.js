import React, {useState, useEffect} from 'react'
import { UserPlaylists, Playlist, useUser } from 'react-spotify-api'
import {
  Grid,
  LinearProgress
} from '@material-ui/core'
import Toolbar from './Toolbar'
import Spotify from 'spotify-web-api-js'
const Playlists = ({token}) => {
  const { data } = useUser()
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  const [isSorting, setIsSorting] = useState(false)
  const spotifyApi = new Spotify()
  spotifyApi.setAccessToken(token)

  useEffect(() => {
    // spotifyApi.skipToNext()
  }, [])

  const reorderPlaylist = async (direction = 'asc') => {
    if (selectedPlaylist && selectedPlaylist.id) {
      let finishedSorting = false
      while (!finishedSorting) {
        const tracks = await spotifyApi.getPlaylistTracks(selectedPlaylist.id)
        let changedOrder = false
        for (var i = 0; i < tracks.items.length - 1; i++) {
          const currentLength = tracks.items[i].track.name.length
          const nextLength = tracks.items[i+1].track.name.length
          // console.log('currentLength, nextLength', currentLength, nextLength)
          if (direction === 'asc' ? currentLength > nextLength : currentLength < nextLength) {
            await spotifyApi.reorderTracksInPlaylist(selectedPlaylist.id, i+1, i)
            changedOrder = true
          }
        }
        finishedSorting = !changedOrder
      }
    }
  }

  useEffect(() => console.log('selectedPlaylist', selectedPlaylist), [selectedPlaylist])

  const handleSort = async (direction = 'asc') => {
    setIsSorting(true)
    await reorderPlaylist(direction)
    setIsSorting(false)
    const updatePlaylist = {...selectedPlaylist}
    setSelectedPlaylist(null)
    setSelectedPlaylist(updatePlaylist)
  }

  return (
    <Grid container>
      <Toolbar onSortDown={() => handleSort('desc')} onSortUp={() => handleSort('asc')}/>
      <Grid item xs={12}>
        {isSorting && <LinearProgress />}
      </Grid>
      <Grid item xs={6}>
        <UserPlaylists>
          {(playlists) =>{
              return playlists && playlists.data ? (
                  playlists.data.items.map(playlist => {
                    if ((data && data.id && data.id === playlist.owner.id) || playlist.collaborative) {
                      return <h1 onClick={() => setSelectedPlaylist(playlist)} key={playlist.id}>{playlist.name}</h1>
                    }
                    return null
                  })
              ) : null}
          }
        </UserPlaylists>
      </Grid>
      <Grid item xs={6}>
        {selectedPlaylist ? <Playlist id={selectedPlaylist.id}>
          {(playlist,) => {
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

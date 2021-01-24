import React, {useState, useEffect} from 'react'
import { UserPlaylists, Playlist, useUser } from 'react-spotify-api'
import {
  Grid,
  List,
  ListItem,
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

  const splitToChunks = (arr, size) => arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), []);

  const reorderPlaylist = async (direction = 'asc') => {
    if (selectedPlaylist && selectedPlaylist.id) {
      let offset = 0
      let allTracks = []
      let reached
      while (allTracks.length < selectedPlaylist.tracks.total) {
        const tracks = await spotifyApi.getPlaylistTracks(selectedPlaylist.id, {offset})
        allTracks = allTracks.concat(tracks.items)
        console.log('tracks', tracks, allTracks)
        offset += 100
      }
      const sortedTracks = allTracks.sort((a, b) => {
        console.log('direction', direction, a, b)
        if (direction === 'asc') {
          return a.track.name.length - b.track.name.length
        }
        return b.track.name.length - a.track.name.length
      })
      const sortedTitles = sortedTracks.map(({track: {name}}) => name)
      console.log('sortedTitles', sortedTitles)
      const sortedUris = sortedTracks.map(({track: {uri}}) => uri)
      const chunks = splitToChunks(sortedUris, 100)
      //replace playlist with first chunk of tracks
      await spotifyApi.replaceTracksInPlaylist(selectedPlaylist.id, chunks.shift())

      for (var chunk of chunks) {
        await spotifyApi.addTracksToPlaylist(selectedPlaylist.id, chunk)
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
      <Grid item xs={3}>
        <UserPlaylists>
          {(playlists) =>{
            return playlists && playlists.data ? (
              <List >
                {playlists.data.items.map(playlist => {
                  if ((data && data.id && playlist.owner && data.id === playlist.owner.id) || playlist.collaborative) {
                    return <ListItem button selected={playlist && selectedPlaylist && playlist.id === selectedPlaylist.id} onClick={() => setSelectedPlaylist(playlist)} key={playlist.id}>{playlist.name}</ListItem>
                  }
                  return null
                })}
              </List>
            ) : null}
          }
        </UserPlaylists>
      </Grid>
      <Grid item xs={9}>
        {selectedPlaylist ? <Playlist id={selectedPlaylist.id}>
          {(playlist,) => {
            if (playlist.data && playlist.data.tracks.items) {
              return playlist.data.tracks.items.map(track => (
                <h1 style={{ paddingLeft: '20px'}}key={track.track.id}>{track.track.name}</h1>
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

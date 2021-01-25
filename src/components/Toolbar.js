import React, {useState} from 'react'
import { useUser } from 'react-spotify-api'
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemText
} from '@material-ui/core'

import {
  ArrowUpward,
  ArrowDownward,
  AccountCircle
} from '@material-ui/icons'

import Cookies from 'js-cookie'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Toolbar = ({selectedPlaylist, onSortDown, onSortUp}) => {
  const classes = useStyles();
  const { data } = useUser()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    console.log('data', data)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    window.open(data.external_urls.spotify, "_blank")
  }

  const handleLogout = () => {
    Cookies.remove('spotifyAuthToken')
    window.open('/', '_self')
  }

  return (
    <AppBar position="static">
      <MuiToolbar>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
            >
            {data && <>
              <MenuItem onClick={handleProfile}>{data.display_name}</MenuItem>
              <MenuItem onClick={handleClose}>Followers: {data.followers.total}</MenuItem>
              <MenuItem onClick={handleClose}>Subscription: {data.product}</MenuItem>
            </>}
            <MenuItem onClick={handleLogout}><ListItemText primaryTypographyProps={{color: 'error'}}>Logout</ListItemText></MenuItem>
          </Menu>
        </div>
        <Typography variant="h6" className={classes.title}>
            Sort a playlist by title length
        </Typography>
        {selectedPlaylist && selectedPlaylist.tracks && <Typography variant="h6" className={classes.title}>
            ({selectedPlaylist.tracks.total} Songs)
        </Typography>}
        <Tooltip title='Ascending'>
          <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={onSortUp}>
            <ArrowUpward />
          </IconButton>
        </Tooltip>
        <Tooltip title='Descending'>
          <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={onSortDown}>
            <ArrowDownward />
          </IconButton>
        </Tooltip>
      </MuiToolbar>
    </AppBar>
  )
}

export default Toolbar

import React, {useState} from 'react'
import { useUser } from 'react-spotify-api'
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core'

import {
  ArrowUpward,
  ArrowDownward,
  AccountCircle
} from '@material-ui/icons'

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

const Toolbar = ({onSort}) => {
  const classes = useStyles();
  const { data, loading, error } = useUser()
  console.log('data', data)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    // setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static">
      <MuiToolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="menu">
          <ArrowDownward />
        </IconButton>
        {data && (
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
              <MenuItem onClick={handleClose}>{data.display_name}</MenuItem>
              <MenuItem onClick={handleClose}>Followers: {data.followers.total}</MenuItem>
            </Menu>
          </div>
        )}
      </MuiToolbar>
    </AppBar>
  )
}

export default Toolbar

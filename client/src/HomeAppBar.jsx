import React, { useState, useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SettingsIcon from "@material-ui/icons/Settings";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import PublicIcon from "@material-ui/icons/Public";
import SignOutIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  }
}));

const HomeAppBar = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [notificationsEl, setNotificationsEl] = useState(null);

  useEffect(() => {
    // Fetch the notifications when mounted
    fetch("/api/notifications", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "bearer: " + localStorage.getItem("auth")
      }
    })
      .then(response => response.json())
      .then(data => {
        setNotifications(data);
      });
  }, []);

  const openMenu = event => {
    setNotificationsEl(event.currentTarget);
  };

  const closeMenu = () => {
    setNotificationsEl(null);
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <AccountCircle />
          </IconButton>
          <Typography variant="h6">Talktime</Typography>
          <div className={classes.grow} />
          <IconButton href="/home/search" color="inherit">
            <Badge color="secondary">
              <Tooltip title="Find someone to talk to">
                <PublicIcon />
              </Tooltip>
            </Badge>
          </IconButton>
          <IconButton href="/home/availability" color="inherit">
            <Badge color="secondary">
              <Tooltip title="Set available times">
                <CalendarIcon />
              </Tooltip>
            </Badge>
          </IconButton>
          <IconButton color="inherit" edge="end" onClick={openMenu}>
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationsEl}
            open={Boolean(notificationsEl)}
            onClose={closeMenu}
          >
            {notifications.map(item => (
              <MenuItem key={item._id} onClick={closeMenu}>
                {item.message}
              </MenuItem>
            ))}
          </Menu>
          <IconButton href="/home/settings" color="inherit">
            <Badge color="secondary">
              <Tooltip title="Change settings">
                <SettingsIcon />
              </Tooltip>
            </Badge>
          </IconButton>
          <IconButton href="/login" color="inherit">
            <Tooltip title="Sign out">
              <SignOutIcon />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default HomeAppBar;

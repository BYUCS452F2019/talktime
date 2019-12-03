import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MeetingTabs() {
  const classes = useStyles();
  const [open_requests, setOpenRequests] = React.useState([])

  useEffect(() => {
    fetchOpenRequests()
  }, []);

  function fetchOpenRequests () {
    fetch("/api/get_opening_request", {
      method: "get",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
    }).then(payload => payload.json())
      .then(result => {
        setOpenRequests(result.filter(req => !req.req_confirmed && !req.req_accepted))
      })
  }

  function handleRequest(req, will_accept) {
    fetch("/api/accept_request", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
      body: JSON.stringify({
        'request_id': "" + req._id
      })
    })
      .then(payload => payload.json())
      .then(result => {
        if ("message" in result && result.message == "Success") {
          alert("Accepted request")
          fetchOpenRequests()
        } else {
          alert("Unable to accept request")
        }
      })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Open Requests
          </Typography>
        </Toolbar>
      </AppBar>
        <List component="nav">
          {
            open_requests.map(req =>
              <ListItem>
                <ListItemText primary={req.other_user_name} />
                <ButtonGroup size="small" variant="contained" color="primary">
                  <Button variant="contained"
                          color="primary"
                          onClick={() => handleRequest(req, true)}>Accept</Button>
                </ButtonGroup>
              </ListItem>)
          }
      </List>
    </div>
  );
}

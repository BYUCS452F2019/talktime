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
    fetch("/api/request", {
      method: "get",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
    }).then(payload => payload.json())
      .then(result => {
        console.log("got reslt: " + JSON.stringify(result))

        let sample = [{
          "user_name": "bob",
          "other_user_id": 0,
          "from_time": 0,
          "to_time": 0,
          "req_accepted": true,
          "req_confirmed": true
        }, {
          "user_name": "jane",
          "other_user_id": 1,
          "from_time": 0,
          "to_time": 0,
          "req_accepted": true,
          "req_confirmed": false
        }]

        setOpenRequests(sample.filter(req => !req.req_confirmed && req.req_accepted))
      })
  }, []);

  function handleRequest(req, will_accept) {
    console.log(JSON.stringify(req))
    console.log("will I accept: " + will_accept)

    /*fetch("/api/request", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
      body: JSON.stringify({
        'partner_id': req.other_id,
        'from_time': req.from_time,
        'to_time': req.to_time
      })
    })
      .then(payload => payload.json())
      .then(result => {
        console.log("result: " + JSON.stringify(result)
      })*/
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
                <ListItemText primary={req.user_name} />
                <ButtonGroup size="small" variant="contained" color="primary">
                  <Button variant="contained"
                          color="primary"
                          onClick={() => handleRequest(req, true)}>Accept</Button>
                  <Button variant="contained"
                          color="secondary"
                          onClick={() => handleRequest(req, false)}>Reject</Button>
                </ButtonGroup>
              </ListItem>)
          }
      </List>
    </div>
  );
}

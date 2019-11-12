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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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
  const [value, setValue] = React.useState(0);
  const [requests, setRequests] = React.useState([])
  const [open_requests, setOpenRequests] = React.useState([])
  const [upcoming_meetings, setUpcomingMeetings] = React.useState([])


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
          "other_user_id": 0,
          "from_time": 0,
          "to_time": 0,
          "req_accepted": true,
          "req_confirmed": true
        }, {
          "other_user_id": 1,
          "from_time": 0,
          "to_time": 0,
          "req_accepted": true,
          "req_confirmed": false
        }]

        setOpenRequests(sample.filter(req => !req.req_confirmed && req.req_accepted))
        setUpcomingMeetings(sample.filter(req => req.req_confirmed && req.req_accepted))
      })
  }, []);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

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
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab label="Upcoming Meetings" />
          <Tab label="Open Requests" />
        </Tabs>
      </AppBar>
      {value === 0 &&
       <TabContainer>
         <List component="nav">
           {
           // TODO do we need the exact day/time, username
             open_requests.map(req =>
                <ListItem>
                  <ListItemText primary={req.other_user_id} />
                </ListItem>)
           }
        </List>
       </TabContainer>}
      {value === 1 &&
       <TabContainer>
         <List component="nav">
           {
           // TODO do we need exact day/time, username
             upcoming_meetings.map(req =>
                <ListItem>
                  <ListItemText primary={req.other_user_id} />
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
       </TabContainer>
      }
    </div>
  );
}

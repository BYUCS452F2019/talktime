import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';


class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upcoming_meetings: []
    }
  }

  componentDidMount() {
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

        this.setState({
          upcoming_meetings: sample.filter(req => req.req_confirmed && req.req_accepted)
        })
      })

    fetch("/api/search_availabilities", {
      method: "get",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      }
    })
      .then(payload => payload.json())
      .then(result => {
        console.log("result: " + JSON.stringify(result))
      })
  }

  render() {
    const { upcoming_meetings } = this.state

    return (
      <Grid container space={4} justify="center" alignItems="center">
        <Grid item xs={8} sm={8} md={8}>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6">
                    Open Requests
                </Typography>
                </Toolbar>
            </AppBar>
            <List component="nav">
            {
            // TODO do we need exact day/time, username
                upcoming_meetings.map(req =>
                    <ListItem>
                    <ListItemText primary={req.other_user_id} />
                    </ListItem>)
            }
            </List>
        </Grid>
      </Grid>
    )
  }
}

export default Dashboard;

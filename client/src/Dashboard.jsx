import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Search from './Search.jsx';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upcoming_meetings: [],
      search_results: []
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
          "day_of_week": 1,
          "from_time": 480,
          "to_time": 720,
          "req_accepted": true,
          "req_confirmed": true
        }, {
          "user_name": "jane",
          "other_user_id": 1,
          "day_of_week": 2,
          "from_time": 860,
          "to_time": 1060,
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
        console.log(result["availabilities"].slice(0, 6))
        this.setState({
          search_results: result["availabilities"].slice(0, 6)
        })
      })
  }

  getRequestTime = (req) => {
    let day_to_time = {0: "Monday", 1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday"}
    let convert_time = (minutes) => {
      let n_hours = (minutes - 8*60) / 60
      return (n_hours + 7) % 12 + 1 + ":00"
    }
    let ampm = (minutes) => minutes >= 720 ? "pm" : "am"

    console.log(req)
    console.log(req.day_of_week)
    console.log(req.from_time)

    return day_to_time[req.day_of_week] + "s, " + convert_time(req.from_time) + ampm(req.from_time) + " - " + convert_time(req.to_time) + ampm(req.to_time)
  }

  render() {
    const { search_results, upcoming_meetings } = this.state
    const classes = {
        card: {
            minWidth: 300,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        }
    }

    return (
      <Grid container space={4}>
        <Grid item xs={8} sm={8} md={8}>
          <Search/>
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6">
                    Upcoming Meetings
                </Typography>
                </Toolbar>
            </AppBar>
            <List component="nav">
            {
                upcoming_meetings.map(req =>
                    <ListItem>
                      <ListItemText primary={req.user_name} />
                      <ListItemText primary={this.getRequestTime(req)}/>
                    </ListItem>)
            }
            </List>
        </Grid>
      </Grid>
    )
  }
}

export default Dashboard;

import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
    fetch("/api/get_opening_request", {
      method: "get",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
    }).then(payload => payload.json())
      .then(result => {
        console.log("got reslt: " + JSON.stringify(result))
        this.setState({
          upcoming_meetings: result.filter(req => req.req_accepted)
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
      let n_hours = (Math.ceil(minutes / 10) * 10- 8*60) / 60
      return (n_hours + 7) % 12 + 1 + ":00"
    }
    let ampm = (minutes) => minutes >= 720 ? "pm" : "am"

    return req.date.split(" ")[0] + " " + convert_time(req.from_time) + ampm(req.from_time) + " - " + convert_time(req.to_time) + ampm(req.to_time)
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
                      <ListItemText primary={req.other_user_name} />
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

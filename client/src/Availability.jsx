import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MeetingTabs from './MeetingTabs.jsx';
import AvailabilityWindow from './AvailabilityWindow.jsx';

class Availability extends Component {
  render () {
    const classes = {
      paper: {
        minHeight: 600
      },
      container: {
        marginTop: 30
      },
    }

    return (
      <Grid container style={classes.container} space={4} justify="center" alignItems="center">
        <Grid item xs={3} sm={3} md={3}>
          <Paper style={classes.paper}>
            <MeetingTabs />
          </Paper>
        </Grid>
        <Grid item xs={1} sm={1} md={1} />
        <Grid item xs={6} sm={6} md={6}>
          <Paper style={classes.paper}>
            <AvailabilityWindow />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default Availability;

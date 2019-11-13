import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AvailabilityTable from './AvailabilityTable.jsx';
import "react-table-drag-select/style.css";

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

class AvailabilityWindow extends Component {
  constructor(props) {
    super(props)

    this.offset_minutes = (new Date()).getTimezoneOffset()
    this.start_minutes = 60 * 8
  }

  extract_timechunk = (col) => {
    let ret = []
    let chunk = []
    for (let i = 0; i < col.length; i++) {
      if (col[i] && chunk.length === 0) {
        chunk.push(i * 60 + this.start_minutes + this.offset_minutes)
      } else if (!col[i] && chunk.length === 1) {
        chunk.push(i * 60 + this.start_minutes + this.offset_minutes - 1)
        ret.push(chunk)
        chunk = []
      }
    }
    if (chunk.length === 1) {
      chunk.push(col.length * 60 + this.start_minutes + this.offset_minutes - 1)
      ret.push(chunk)
    }
    return ret
  }

  update_availability = (cells) => {
    let get_column = (array, n) => array.slice(1).map(r => r[n])
    let by_day = [...Array(7).keys()].map(n => get_column(cells, n + 1))
    let available_times = by_day.map(this.extract_timechunk)

    Promise.all(available_times.map((availability_set, i) => {
      return availability_set.map(availability => {
        return fetch("/api/availabilities", {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer: ' + localStorage.getItem("auth")
          },
          body: JSON.stringify({
            "user_id": localStorage.getItem("id"),
            "day_of_week": i,
            "from_time": availability[0],
            "to_time": availability[1]
          })
        })
      })
    }).flat())
           .then(values => Promise.all(values.map(v => v.json())))
           .then(jsons => {
             if (jsons.every(j => j.success)) {
               alert("Availabilities saved")
             } else {
               alert("Unable to save availabilities!")
             }
           })
  }

  render () {
    return (
      <div>
        <AppBar position="static">
          <Tabs value={0} variant="fullWidth">
            <Tab label="My Availability">
            </Tab>
          </Tabs>
        </AppBar> 
      <AvailabilityTable
      callback={this.update_availability}
      offset_minutes={this.offset_minutes}
      start_minutes={this.start_minutes}
      />
      </div>
    );
  } 
} 

export default AvailabilityWindow;

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
  }

  update_availability = (cells) => {
    console.log("update availability")
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
      <AvailabilityTable callback={this.update_availability}/>
      </div>
    );
  } 
} 

export default AvailabilityWindow;

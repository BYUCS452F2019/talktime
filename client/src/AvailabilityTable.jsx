import React from "react";
import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";
import Button from '@material-ui/core/Button';

class AvailabilityTable extends React.Component {
  state = {
    cells: [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false]
    ]
  };

  componentDidMount() {
    console.log("hello there")
    // fetch get availabilities
    // put them in a array of arrays
    // set state initialization to be this array of arrays
    //
    let init = [[[1220, 1320]], [], [], [], [], [], []]
    for (let day = 0; day < init.length; day++) {
      let blocks = init[day]


    }
  }

  render = () =>
    <div>
      <TableDragSelect
        value={this.state.cells}
        onChange={cells => {
          this.setState({ cells })
        }}
      >
        <tr>
          <th disabled/>
          <th disabled>M</th>
          <th disabled>T</th>
          <th disabled>W</th>
          <th disabled>Th</th>
          <th disabled>F</th>
          <th disabled>Sat</th>
          <th disabled>Sun</th>
        </tr>
        {this.state.cells.slice(1).map((row, i) =>
            (<tr key={i}>
              <td key={(i + 30 + "")} disabled>{(i + 7) % 12 + 1 + ":00"}</td>
              {row.slice(1).map(col => (<td />))}
            </tr>))}
      </TableDragSelect>
      <Button variant="contained"
              color="primary"
              onClick={() => this.props.callback(this.state.cells)}>
        Save Changes
      </Button>
  </div>


}

export default AvailabilityTable;

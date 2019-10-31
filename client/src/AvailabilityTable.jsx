import React from "react";
import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";
import Button from '@material-ui/core/Button';

class AvailabilityTable extends React.Component {
  constructor(props) {
    super(props)
  }

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

  is_available = (r, c, data) => {
    let from = this.props.offset_minutes + this.props.start_minutes + (r - 1) * 60
    let to = this.props.offset_minutes + this.props.start_minutes + r * 60 - 1
    let ans = data.filter(x => x.day_of_week == c - 1)
                  .some(x => from <= x.to_time && x.from_time <= to)
    return ans
  }

  componentDidMount() {
    fetch("/api/availabilities", {
        method: "get",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'bearer: ' + localStorage.getItem("auth")
        },
    }).then(response => {
        return response.json()
    })
      .then(data => {
        let new_cells = this.state.cells.map((row, r) =>
            row.map((_, c) => this.is_available(r, c, data.availabilities)))
        this.setState({ cells: new_cells })
    })
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

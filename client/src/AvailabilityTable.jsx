import React from "react";
import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";

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

  render = () =>
    <TableDragSelect
      value={this.state.cells}
      onChange={cells => {
        this.props.callback(cells)
        this.setState({ cells })
      }}
    >
      <tr>
        <th disabled/>
        <th disabled>Sun</th>
        <th disabled>M</th>
        <th disabled>T</th>
        <th disabled>W</th>
        <th disabled>Th</th>
        <th disabled>F</th>
        <th disabled>Sat</th>
      </tr>
      {this.state.cells.slice(1).map((row, i) =>
          (<tr key={i}>
             <td key={(i + 30 + "")} disabled>{(i + 7) % 12 + 1 + ":00"}</td>
             {row.slice(1).map(col => (<td />))}
           </tr>))}
    </TableDragSelect>;

}

export default AvailabilityTable;

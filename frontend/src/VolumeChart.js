import React from 'react';
import {Bar} from 'react-chartjs-2';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


class VolumeChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="volumechart">
            <List>
          <ListItem>
            <ListItemText primary="Volume" secondary="Transactions per Block" />
          </ListItem>
        </List>

      <Bar data={this.props.data} width={400} height={200} redraw={this.props.shouldRedraw} />
    </div>
    )
  };

}

export default (VolumeChart);

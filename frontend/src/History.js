import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  } 

});

class History extends React.Component {
  constructor(props) {
   super(props);
  }

 

  render() {

    return (
      <Paper className="transactions">
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>TxHash</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.data.map(row => {
              return (
                <TableRow>
                  <TableCell>{row.hash}</TableCell>
                  <TableCell><a href={row.from}>{row.from}</a></TableCell>
                  <TableCell><a href={row.to}>{row.to}</a></TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  
  }
}


export default (History);
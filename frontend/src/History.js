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
  },
});

class History extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
      items: [],
      loadingState: false
    };
    const { classes } = props;

    console.log("TX:");
    console.log(this.props.data);
  }

  componentDidMount() {
   // this.loadMoreItems();

    //this.refs.iScroll.addEventListener("scroll", () => {
     // if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=this.refs.iScroll.scrollHeight){
       // this.loadMoreItems();
     // }
   // });
  }

 

  render() {
    // return (
    //   <div className="history" ref="iScroll" style={{ overflow: "auto", height: "200px" }}>
    //     <List>
    //       {this.props.data.map(item => (
    //           <ListItem key={`block-${item}`}>
    //           {/* <a href={"/" + item.id}> */}
    //             <ListItemText primary={`${item.hash}`}  secondary={`${item.from} to ${item.to}`}/>
    //             {/* </a> */}
    //       </ListItem>))}
    //     </List>

    //   </div>
    // );
    return (
      <div className="history">
      <Paper >
        <Table style={{ overflow: "auto", height: "200px" }}>
          <TableHead>
            <TableRow>
              <TableCell>TxHash</TableCell>
              <TableCell numeric>From</TableCell>
              <TableCell numeric>To</TableCell>
              <TableCell numeric>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.data.map(row => {
              return (
                <TableRow>
                  <TableCell numeric>{row.hash}</TableCell>
                  <TableCell numeric>{row.from}</TableCell>
                  <TableCell numeric>{row.to}</TableCell>
                  <TableCell numeric>{row.value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      </div>
    );
  
  }
}


export default (History);

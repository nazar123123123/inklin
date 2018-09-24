
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = {
  avatar: {
    margin: 10,
  },
  whiteDot: {
    margin: 10,
    color: '#fff',
    backgroundColor: "white",
  },
  blueDot: {
    margin: 10,
    color: '#fff',
    backgroundColor: "#2aaee2",
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
};



class Help extends React.Component {

  constructor(props) {
    super(props); 
  }

    
  render() {

    return (
      <div className="helpPane">
        <List>
        <ListItem>
        <ListItemText primary="How to use" secondary="Each transaction on the Blockchain is represented by the connection of one node to another.  Double clicking on a node will drill-down to view all transactions for that address." />
      </ListItem> 

        <ListItem>
            <ListItemText primary="Legend" />
          </ListItem>
          <span class='whitedot'></span> Ethereum Address
          <p/>
          <span class='bluedot'></span> Token/Contract Address
          <p/>
          <span class='tx'></span> Transaction


           <ListItem >
            <ListItemText primary="Searching" secondary="You can search for an Address, Wallet or Contract as well as an Ethereum Block" />
          </ListItem> 
        </List>
      </div>
    );
  }
}



export default withStyles(styles)(Help);
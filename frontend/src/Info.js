
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DatePicker from './DatePicker'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: "black",
    fontColor: "white",
  },
});

const style = {backgroundColor: "black", color: "white"};


class Info extends React.Component {

  constructor(props) {
    super(props); 
  }

    
  render() {

    const stats = `${this.props.block_info.tokens} ERC20 transactions, ${this.props.block_info.contracts} contracts created, Ξ${parseInt(this.props.block_info.ethvalue)} transferred`
    return (
      <div className="infoPane">
        <List>
        <ListItem>
            <ListItemText primary="Statistics " secondary={stats} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Block" secondary={this.props.blocknumber} />

          </ListItem> 

          <ListItem>
            <ListItemText primary="Time" />
            <DatePicker block_time={this.props.block_time}/>
          </ListItem> 

           <ListItem >
            <ListItemText primary="Transactions" secondary={this.props.numberoftxs} />
          </ListItem> 
        </List>
      </div>
    );
  }
}



export default withStyles(styles)(Info);
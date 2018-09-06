import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


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

class Lovely extends React.Component {
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
      <Typography component="p" style={{ margin: "5px", fontSize: "40pt" }}>
        This is something...
      </Typography>
      <Typography component="p" style={{ margin: "5px", fontSize: "40pt" }}>
        So is this...
      </Typography>

      </Paper>
      </div>
    );
  
  }
}


export default (Lovely);

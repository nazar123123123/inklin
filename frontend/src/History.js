import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class History extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
      items: [],
      loadingState: false
    };

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
    return (
      <div className="history" ref="iScroll" style={{ overflow: "auto", height: "200px" }}>
        <List>
          {this.props.data.map(item => (
              <ListItem key={`block-${item}`}>
              {/* <a href={"/" + item.id}> */}
                <ListItemText primary={`${item.hash}`}  secondary={`${item.from} to ${item.to}`}/>
                {/* </a> */}
          </ListItem>))}
        </List>

      </div>
    );
  }
}


export default (History);

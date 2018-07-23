import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class History extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
      items: {},
      loadingState: false
    };
  }

  componentDidMount() {
    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >=this.refs.iScroll.scrollHeight){
        this.loadMoreItems();
      }
    });
  }

  displayItems() {
    var items = [];
    console.log("Displaying these items....");
    for (var i = 0; i < this.state.items; i++) {
        console.log(this.state.items[i]);
      items.push(<ListItem><ListItemText primary={this.state.items[i]} /></ListItem>);
    }
    return items;
  }

  loadMoreItems() {
    this.setState({ loadingState: true });

    const url = `${process.env.REACT_APP_API_SERVER}/api/inklin/history/${this.props.current_block}`
    console.log(url);
    fetch(url).then(res => res.json()).then(data => {
          console.log(data);
          this.setState({ items: data, loadingState: false });
      });

    // setTimeout(() => {
    //   this.setState({ items: this.state.items + 10, loadingState: false });
    // }, 3000);
  }

  render() {
    return (
      <div className="history" ref="iScroll" style={{ height: "200px", overflow: "auto" }}>
        <List>
          {this.displayItems()}
        </List>
        {this.state.loadingState ? <p className="loading"> Loading More Items..</p> : ""}

      </div>
    );
  }
}


export default (History);

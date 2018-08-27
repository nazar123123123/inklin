import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReportIcon from '@material-ui/icons/Report';
import SearchIcon from '@material-ui/icons/Search';
import GoLive from '@material-ui/icons/FiberSmartRecord';
import ShowVolume from '@material-ui/icons/Assessment';
import Divider from '@material-ui/core/Divider';
import ShowStats from '@material-ui/icons/Description';

import ReactTooltip from 'react-tooltip'
import Twitter from 'mdi-material-ui/Twitter'
import Github from 'mdi-material-ui/GithubCircle'
import EthereumIcon from 'mdi-material-ui/Ethereum'
import HeartIcon from 'mdi-material-ui/Heart'
import ShareIcon from 'mdi-material-ui/ShareVariant'
import SharingModal from './Sharing'

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 999999,
    position: 'absolute',
    display: 'flex',
    height: "100%"
    
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    borderRight: "0px",
    borderTop: "0px",
    backgroundColor: 'rgba(0,0,0,0.5)'

  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

const bottomList = {
  position: 'absolute',
  bottom: '10px'
};

const topList = {
  position: 'absolute',
  top: '64px'
};

class MiniDrawer extends React.Component {
  state = {
    open: false,
    sharing: false
  };

  handleOpenShare = () => {
    console.log("Open Share");
    this.setState({sharing: true})
  }


  handleCloseShare = () => {
    console.log("Close Share");
    this.setState({sharing: false})
  }

  handleFavourite = () => {

    const fav_url = `${process.env.REACT_APP_API_SERVER}/api/inklin/like/${this.props.currentBlock}`

    fetch(fav_url).then(res => res.json()).then(data => {
      console.log(`Favourited ${this.props.currentBlock}`)
    });

  }

  handleView = () => {
    console.log(this.props.perpective2d)

  }


  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={true}
        >

          <List>
          <ListItem button component="a" href="/">
              <ListItemIcon>
                <EthereumIcon />
              </ListItemIcon>
            </ListItem>

            <ListItem button>
            <ListItemIcon onClick={this.props.handleLive} data-tip={this.props.isLive ? "Stop Live View" : "Start Live View"  } >
                <GoLive style={this.props.isLive ? { color: "#2aaee2" } :  { color: "white" } }/>
              </ListItemIcon>
              <ListItemText primary="Switch Live" />
            </ListItem>


            <ListItem button>
            <ListItemIcon onClick={this.props.handleStats} data-tip={this.props.showStats ? "Hide Block Statistics" : "Show Block Statistics"  } >
                <ShowStats style={this.props.showStats ? { color: "#2aaee2" } :  { color: "white" } }/>
              </ListItemIcon>
              <ListItemText primary="Switch Live" />
            </ListItem>

            <ListItem button>
            <ListItemIcon onClick={this.props.handleSearch} data-tip={this.props.showSearch ? "Hide Search" : "Show Search"  } >
                <SearchIcon style={this.props.showSearch && { color: "#2aaee2" } ||  { color: "white" }  } />
              </ListItemIcon>
              <ListItemText primary="Show Search" />
            </ListItem>

            <ListItem button>
              <ListItemIcon onClick={this.props.handleVolume} data-tip={this.props.showVolume ? "Hide Volume Chart" : "Show Volume Chart"  } >
                <ShowVolume style={this.props.showVolume ? { color: "#2aaee2" } :  { color: "white" }  } />
              </ListItemIcon>
              <ListItemText primary="Show Volume" />
            </ListItem>
            <Divider />

            <ListItem button onClick={this.handleFavourite}>
              <ListItemIcon data-tip="Mark this as interesting">
                <HeartIcon style={{ color: "#ff6961" }} />
              </ListItemIcon>
              <ListItemText primary="Show Volume" />
            </ListItem>
            {/* <ListItem button onClick={this.state.sharing ? this.handleCloseShare : this.handleOpenShare}>
              <ListItemIcon data-tip="Share this view">
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="Show Volume" />
            </ListItem> */}

          </List>
          <List style={bottomList}>
            <ListItem button component="a" href="https://github.com/justindavies/inklin/issues">
              <ListItemIcon data-tip="Issue/Feature Request">
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Report issue" />
            </ListItem>

            <ListItem button component="a" href="https://twitter.com/justindavies">
              <ListItemIcon data-tip="Twitter">
                <Twitter />
              </ListItemIcon>
              <ListItemText primary="Report issue" />
            </ListItem>


            <ListItem button component="a" href="https://github.com/justindavies/inklin">
              <ListItemIcon data-tip="GitHub">
                <Github />
              </ListItemIcon>
              <ListItemText primary="Report issue" />
            </ListItem>

            <ReactTooltip place="right" type="dark" effect="solid" />


          </List>
        </Drawer>
        {this.state.sharing && <SharingModal viewing={this.props.objectViewed} />}
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MiniDrawer);
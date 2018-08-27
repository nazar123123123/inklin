import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TumblrShareButton,
  EmailShareButton,

  FacebookShareCount,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  EmailIcon,

} from 'react-share';

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: 100,
    left: 100,
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class Sharing extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    console.log("Props:");
    console.log(this.props.block_number);
    const { classes } = this.props;

    const shareurl = `http://inkl.in/${this.props.block_number}`
    const quote = `Take a look at the visualisation of Block ${this.props.block_number} of the Ethereum Blockchain...`
    const title = `Ethereum Block ${this.props.block_number}`

    return (
      <div className="sharing">
        <List>
          <ListItem>
            <Avatar>
              <FacebookShareButton url={shareurl} quote={quote} >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </Avatar>
            <ListItemText primary="Facebook" />
          </ListItem>
          <ListItem>
            <Avatar>
              <TwitterShareButton url={shareurl} title={quote} via={"inklinalert"} >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </Avatar>
            <ListItemText primary="Twitter" />
          </ListItem>
          <ListItem>
            <Avatar>

              <RedditShareButton url={shareurl} title={title} >
                <RedditIcon size={32} round />
              </RedditShareButton>
            </Avatar>
            <ListItemText primary="Reddit" />
          </ListItem>
          <ListItem>
            <Avatar>
              <TelegramShareButton url={shareurl} title={quote} >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
            </Avatar>
            <ListItemText primary="Telegram" />
          </ListItem>
          <ListItem>
            <Avatar>
              <LinkedinShareButton url={shareurl} description={quote} title={title} >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>


            </Avatar>
            <ListItemText primary="LinkedIn" />
          </ListItem>
          <ListItem>
            <Avatar>
              <GooglePlusShareButton url={shareurl} title={title} description={quote} >
                <GooglePlusIcon size={32} round />
              </GooglePlusShareButton>
            </Avatar>
            <ListItemText primary="Google+" />
          </ListItem>

        </List>

      </div>
    );
  }
}

Sharing.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SharingWrapped = withStyles(styles)(Sharing);

export default SharingWrapped;
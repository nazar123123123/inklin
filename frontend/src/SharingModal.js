import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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

class SharingModal extends React.Component {



  render() {
    const { classes } = this.props;

    return (
      <div className="sharing">
        <FacebookShareButton url={"http://inkl.in/"} quote={"Hello"}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton url={"http://inkl.in/"} quote={"Hello"}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <RedditShareButton url={"http://inkl.in/"} quote={"Hello"}>
          <RedditIcon size={32} round />
        </RedditShareButton>

        <TelegramShareButton url={"http://inkl.in/"} quote={"Hello"}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <LinkedinShareButton url={"http://inkl.in/"} quote={"Hello"}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <GooglePlusShareButton url={"http://inkl.in/"} quote={"Hello"}>
          <GooglePlusIcon size={32} round />
        </GooglePlusShareButton>


      </div>
    );
  }
}

SharingModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SharingModalWrapped = withStyles(styles)(SharingModal);

export default SharingModalWrapped;
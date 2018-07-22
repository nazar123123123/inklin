import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
  container: {
    width: 300,
  },
};

class SimpleSlider extends React.Component {
  state = { value: 50 };


  handleChange = (event, value) => this.setState({ value });

  render () {
    const { value } = this.state
    return (
      <div className='slider'>
        <Typography id="label">Skip to block...</Typography>
        <Slider value={this.props.currentBlock} max={this.props.currentBlock} min={1} aria-labelledby="label" onChange={this.handleChange} />
        <div className='value'>{this.state.value}</div>
      </div>
    )
  }
}

SimpleSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSlider);

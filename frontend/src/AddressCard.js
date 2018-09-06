import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ShareIcon from '@material-ui/icons/Share';
import DrilldownIcon from '@material-ui/icons/CropFree';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    card: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: "white",
    },
});

class AddressCard extends React.Component {
    state = { expanded: false };

    constructor(props) {
        super(props);
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };


    render() {
        const { classes } = this.props;

        const stats = `${this.props.numberoftxs} transactions (${this.props.block_info.tokens} ERC20), ${this.props.block_info.contracts} contracts created, Ξ${parseInt(this.props.block_info.ethvalue)} transferred`
        return (
            <Card className="address">
                <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                        <DrilldownIcon />
                        </Avatar>
                    }

                    title={this.props.title}
                    subheader={this.props.block_time}
                />

                <CardContent>
                    <Typography component="p" style={{ width: "300px" }}>
                        {stats}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                <Button variant="contained" color="secondary">
                Show Transactions
              </Button>
                        </CardActions>
               
            </Card>
        );
    }
}

AddressCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddressCard);
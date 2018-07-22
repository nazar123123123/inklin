import React, { PureComponent } from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

export default class DatePicker extends PureComponent {

  constructor(props) {
    super(props); 
    console.log(new Date(this.props.block_time));
  }


    state = {
        selectedDate: new Date(),
    }

    handleDateChange = (date) => {
        this.setState({ selectedDate: date });
    } 

    render() {
        const { selectedDate } = this.state; 

        return (
            <div className="datepicker">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        value={new Date(this.props.block_time) }
                        onChange={this.handleDateChange}
                        disableFuture
                    />
                </MuiPickersUtilsProvider>
            </div>
        );
    }
}


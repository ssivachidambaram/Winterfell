var React = require('react');
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

class DateInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value : this.props.value
    };
  }

  handleChange(date) {
    this.setState({
      value : date
    }, this.props.onChange.bind(null, date));
  }

  render() {
    return (
      <DatePicker
        selected={this.state.value}
        onChange={this.handleChange.bind(this)}
        className={this.props.classes.input}
      />
    );
  }

};

DateInput.defaultProps = {
  classes     : {},
  name        : '',
  id          : '',
  value       : '',
  placeholder : '',
  onChange    : () => {},
  onBlur      : () => {},
  onKeyDown   : () => {}
};

module.exports = DateInput;
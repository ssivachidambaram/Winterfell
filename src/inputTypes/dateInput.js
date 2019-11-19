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

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
    }
  }

  render() {
    return (
      <div id={this.props.name}>
      <DatePicker
        selected={this.state.value}
        onChange={this.handleChange.bind(this)}
        className={this.props.classes.input}  
        showMonthDropdown
        showYearDropdown
        dateFormat="yyyy/MM/dd"
      />
      </div>
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
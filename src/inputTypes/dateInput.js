var React = require('react');
import DatePicker from "react-datepicker";
import parseISO from 'date-fns/parseISO';
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
    const format = (this.props.text && this.props.text !== "") ? this.props.text : "yyyy/MM/dd";
    let selectedDate = this.state.value;
    if (Object.prototype.toString.call(this.state.value) === '[object String]') {
      selectedDate = parseISO(this.state.value);
    }
    return (
      <div id={this.props.name}>
        <DatePicker
          selected={selectedDate}
          onChange={this.handleChange.bind(this)}
          className={this.props.classes.input}  
          showMonthDropdown
          showYearDropdown
          dateFormat={format}
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
var React = require('react');
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef();

class RecaptchaInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value : this.props.value
    };
  }

  handleChange(val) {
    this.setState({
      value : val
    }, this.props.onChange.bind(null, val));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
    }
  }

  render() {
    return (
      <div id={this.props.name}>
        <ReCAPTCHA ref={recaptchaRef} sitekey={this.props.placeholder} onChange={this.handleChange.bind(this)} />      
      </div>
    );
  }

};

RecaptchaInput.defaultProps = {
  classes     : {},
  name        : '',
  id          : '',
  value       : '',
  placeholder : '',
  onChange    : () => {},
  onBlur      : () => {},
  onKeyDown   : () => {}
};

module.exports = RecaptchaInput;
var React = require('react');

class TextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value : this.props.value
    };
  }

  handleChange(e) {
    var value = e.target.value.trim();
    this.setState({
      value : e.target.value
    }, this.props.onChange.bind(null, value));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
    }
  }

  render() {
    return (
      <input type="text"
             name={this.props.name}
             id={this.props.id}
             aria-labelledby={this.props.labelId}
             className={this.props.classes.input + this.props.questionInputClass}
             placeholder={this.props.placeholder}
             value={this.state.value}
             required={this.props.required
                         ? 'required'
                         : undefined}
             onChange={this.handleChange.bind(this)}
             onBlur={this.props.onBlur.bind(null, this.state.value.trim())}
             onKeyDown={this.props.onKeyDown} />
    );
  }

};

TextInput.defaultProps = {
  classes     : {},
  name        : '',
  id          : '',
  value       : '',
  placeholder : '',
  onChange    : () => {},
  onBlur      : () => {},
  onKeyDown   : () => {}
};

module.exports = TextInput;
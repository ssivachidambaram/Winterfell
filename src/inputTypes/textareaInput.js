var React = require('react');
import resizePolyfill from 'resize-polyfill';

class TextareaInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value : this.props.value
    };
  }

  handleChange(e) {
    this.setState({
      value : e.target.value
    }, this.props.onChange.bind(null, e.target.value));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
    }
  }

  render() {
    return (
      <textarea type="text"
                name={this.props.name}
                id={this.props.id}
                aria-labelledby={this.props.labelId}
                className={this.props.classes.textAreaInput}
                placeholder={this.props.placeholder}
                value={this.state.value}
                rows={this.props.rows}
                required={this.props.required
                            ? 'required'
                            : undefined}
                onChange={this.handleChange.bind(this)}
                onBlur={this.props.onBlur.bind(null, this.state.value)} 
                ref={(el) => {
                  if (el) {
                    resizePolyfill(el, true);
                  }
                }}
                />
    );
  }

};

TextareaInput.defaultProps = {
  classes     : {},
  name        : '',
  id          : '',
  value       : '',
  placeholder : '',
  onChange    : () => {},
  onBlur      : () => {},
  rows        : 3
};

module.exports = TextareaInput;
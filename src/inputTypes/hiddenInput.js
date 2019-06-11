var React = require('react');

class HiddenInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value : this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
    }
  }

  render() {
    return (
      <input type="hidden"
             name={this.props.name}
             value={this.state.value}/>
    );
  }

};

HiddenInput.defaultProps = {
  name  : '',
  value : ''
};

module.exports = HiddenInput;
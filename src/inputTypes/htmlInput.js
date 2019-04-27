var React = require('react');

class HtmlInput extends React.Component {

  constructor(props) {
    super(props);
    console.log('cont', this.props.value);
    console.log('conttext', this.props.text);
    this.state = {
      text : this.props.text
    };
  }

  handleChange(e) {
    this.setState({
      value : e.target.value
    }, this.props.onChange.bind(null, e.target.value));
  }

  createMarkup(panelHtml) {
    console.log(panelHtml);
    return {__html: panelHtml};
  }

  render() {
    return (
      <React.Fragment>
      {typeof this.state.text !== 'undefined'
      ? (
        <div dangerouslySetInnerHTML={this.createMarkup(this.state.text)} />
      )
      : ""}
      </React.Fragment>
    );
  }

};

HtmlInput.defaultProps = {
  classes     : {},
  name        : '',
  id          : '',
  value       : '',
  text       : '',
  placeholder : '',
  onChange    : () => {},
  onBlur      : () => {},
  onKeyDown   : () => {}
};

module.exports = HtmlInput;
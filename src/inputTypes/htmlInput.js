var React = require('react');

class HtmlInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text : this.props.text
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text) {
      this.setState({ text: nextProps.text }, this.props.onChange.bind(null, nextProps.text));
    }
  }

  createMarkup(panelHtml) {
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
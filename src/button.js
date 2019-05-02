var React = require('react');

class Button extends React.Component {

  handleClick(e) {
    e.preventDefault();

    this.props.onClick();
  }

  render() {
    var text =  this.props.text;
    if(this.props.condition.field !== '' && this.props.condition.value !== ''){
      if(this.props.questionAnswers[this.props.condition.field] !== undefined && this.props.condition.value.indexOf(this.props.questionAnswers[this.props.condition.field])> -1 ){
        text = this.props.condition.text;
      }      
    }    
    return (
      <button href="#"
         className={this.props.className}
         onClick={this.handleClick.bind(this)}>
        {text}
      </button>
    );
  }

};

Button.defaultProps = {
  text      : 'Submit',
  className : undefined,
  onClick   : () => {},
  condition:{
    field: '',
    text: '',
    value: ''
  },
  questionAnswers: {}
};

module.exports = Button;
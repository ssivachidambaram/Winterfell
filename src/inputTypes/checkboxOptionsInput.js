var React = require('react');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
var cloneArray = require('../lib/cloneArray');

class CheckboxOptionsInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value : this.props.value.length > 0
                ? cloneArray(this.props.value)
                : []
    };
  }

  handleChange(newVal, e) {
    var currentValue = this.state.value;

    if (e.target.checked) {
      currentValue.push(newVal);
    } else {
      currentValue = currentValue.filter(v => v != newVal);
    }


    this.setState({
      value : currentValue
    }, this.props.onChange.bind(null, currentValue));
  }

  displayChange(event, questionId) {
    document.getElementById('out-'+questionId).classList.remove('d-none');
    document.getElementById('icon-'+questionId).classList.add('d-none');
  } 

  render() {
    return (
      <ul className={this.props.classes.checkboxList} id={this.props.name}>
        {this.props.options.map((opt,index) => {
          var labelAlign = (opt.icons && this.state.value.indexOf(opt.value) > -1) ? 'd-inline' : '';
          return (
            <React.Fragment>
            {opt.icons && (
              <li key={opt.value}
                  className={this.props.classes.checkboxListItem}>
                  <div className={`float-left width-label`}>
                  <input type="checkbox"
                        name={this.props.name}
                        aria-labelledby={this.props.labelId}
                        value={opt.value}
                        checked={this.state.value.indexOf(opt.value) > -1}
                        className={this.props.classes.checkbox}
                        id={this.props.labelId+index}
                        required={this.props.required
                                    ? 'required'
                                    : undefined}
                        onChange={this.handleChange.bind(this, opt.value)}
                        onBlur={this.props.onBlur.bind(null, this.state.value)} />              
                <label className={` ${this.props.classes.checkboxLabel} `}
                      id={this.props.labelId+index} for={this.props.labelId+index}>

                  {opt.text}
                </label>
                </div>
                <div className="float-right">
                {opt.icons && this.state.value.indexOf(opt.value) > -1 && opt.icons.map((icons,ind) =>
              <React.Fragment>
                {!this.props.questionAnswers[icons.questionId] && (
                  <a href="javascript:void(0);" className="blackc no-u" onClick={(event) => this.displayChange(event, icons.questionId )} id={`icon-${icons.questionId}`}> <FontAwesomeIcon icon={icons.icon} className="fa-fw text-24" /> </a>
                )}
              </React.Fragment>            
            )}
            </div>
              </li>
          )}
            {!opt.icons && (
              <li key={opt.value}
                  className={this.props.classes.checkboxListItem}>
                  <input type="checkbox"
                        name={this.props.name}
                        aria-labelledby={this.props.labelId}
                        value={opt.value}
                        checked={this.state.value.indexOf(opt.value) > -1}
                        className={this.props.classes.checkbox}
                        id={this.props.labelId+index}
                        required={this.props.required
                                    ? 'required'
                                    : undefined}
                        onChange={this.handleChange.bind(this, opt.value)}
                        onBlur={this.props.onBlur.bind(null, this.state.value)} />              
                <label className={` ${this.props.classes.checkboxLabel}`}
                      id={this.props.labelId+index} for={this.props.labelId+index}>

                  {opt.text}
                </label>
              </li>
          )}
          </React.Fragment>          
          )}
        )}
      </ul>
    );
  }

};

CheckboxOptionsInput.defaultProps = {
  classes  : {},
  name     : '',
  value    : [],
  options  : [],
  onChange : () => {},
  onBlur   : () => {}
};

module.exports = CheckboxOptionsInput;

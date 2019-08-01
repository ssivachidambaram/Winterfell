var React = require('react');
var _     = require('lodash').noConflict();

class SelectInput extends React.Component {

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
    if (_.isEqual(this.props.conditionalAnswers, nextProps.conditionalAnswers) === false) {
      this.setState({ value: '' }, this.props.onChange.bind(null, ''));
    }
    if (_.isEqual(this.props.mappingConditionalAnswers, nextProps.mappingConditionalAnswers) === false) {
      this.setState({ value: '' }, this.props.onChange.bind(null, ''));
    }
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
    }
  }

  render() {
    var options = this.props.options.map(opt => {
      let isSatisfied = 1;
      if (opt.mappingConditions !== undefined) {        
        isSatisfied = 0;
        opt.mappingConditions.forEach(condition => {
          let conditionCount = 0;
          let conditionSuccessCount = 0;
            Object.keys(condition).forEach(questionId => {
              conditionCount += 1;
            if (this.props.mappingConditionalAnswers[questionId] !== undefined) {
              if (
                Array.isArray(condition[questionId]) && Array.isArray(this.props.mappingConditionalAnswers[questionId]) &&
                _.intersection(condition[questionId], this.props.mappingConditionalAnswers[questionId]).length > 0
              ) {
                conditionSuccessCount += 1;
              }else if (
                Array.isArray(condition[questionId]) &&
                condition[questionId].indexOf(
                  this.props.mappingConditionalAnswers[questionId]
                ) > -1
              ) {
                conditionSuccessCount += 1;
              } else if (
                !Array.isArray(condition[questionId]) &&
                condition[questionId] ===
                  this.props.mappingConditionalAnswers[questionId]
              ) {
                conditionSuccessCount += 1;
              }
            }
          });
          if (conditionCount === conditionSuccessCount) {
            isSatisfied++;
          }
        });
      }
      if (isSatisfied) {
        if (typeof opt.conditions !== 'undefined' && opt.conditions.length > 0) {
          let c = 0;
          opt.conditions
          .forEach(condition => {
            if ((Array.isArray(condition.value) && condition.value.indexOf(this.props.conditionalAnswers[condition.questionId]) > -1) || (this.props.conditionalAnswers[condition.questionId] === condition.value)) {
              c++;
            }
          });
          if (opt.conditions.length == c) {
            return (
              <option key={opt.value}
                      value={opt.value}>
                {opt.text}
              </option>
            );
          }
        } else {
          return (
            <option key={opt.value}
                    value={opt.value}>
              {opt.text}
            </option>
          );
        }
      }
    });

    return (
      <select name={this.props.name}
              id={this.props.id}
              className={this.props.classes.select + this.props.questionInputClass}
              value={this.state.value}
              ref="select"
              required={this.props.required
                          ? 'required'
                          : undefined}
              onChange={this.handleChange.bind(this)}
              onBlur={this.props.onBlur.bind(null, this.state.value)}>
        {options}
      </select>
    );
  }

  componentDidMount() {
    /*
     * Selects automatically pick the first item, so
     * make sure we set it.
     */
    this.handleChange({
      target : {
        value : this.refs.select.value
      }
    });
  }

};

SelectInput.defaultProps = {
  classes     : {},
  name        : '',
  id          : '',
  value       : '',
  options     : [],
  onChange    : () => {},
  onBlur      : () => {}
};

module.exports = SelectInput;

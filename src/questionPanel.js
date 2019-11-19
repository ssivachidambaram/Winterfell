var React = require('react');
var _ = require('lodash').noConflict();
var KeyCodez = require('keycodez');

var Validation = require('./lib/validation');
var ErrorMessages = require('./lib/errors');

var Button = require('./button');
var QuestionSet = require('./questionSet');
var evaluatePredicates = require('./lib/evaluatePredicates');
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class QuestionSetWrapper extends React.Component {
  render() {
    const questionSetWrapper = this.props.questionSetWrapper;
    const questionSet = this.props.questionSet;
    const questionSetId = this.props.questionSetId;
    const addMoreQuestionSets = this.props.addMoreQuestionSets;
    const questionAnswers = this.props.questionAnswers;
    var showAddMore = false, showRemoveMore = false;
    var addMoreName = '', addMoreButton = '', addMoreButtonClass = '', removeMoreButton = '', removeMoreButtonClass = '', removeQuestionSetIndex = '';
    var removeQuestionSets = Array(), originalQuestionSets = Array();
    if (addMoreQuestionSets) {
      addMoreQuestionSets.forEach((addMoreQuestionSet) => {
        originalQuestionSets = addMoreQuestionSet.questionSets;
        var lastQuestionSet = addMoreQuestionSet.questionSets[addMoreQuestionSet.questionSets.length-1];
        var removeQuestionSetIds = Array();
        if (questionAnswers[addMoreQuestionSet.addMoreName] > 1) {
          for (var i = 1; i <= questionAnswers[addMoreQuestionSet.addMoreName]; i++) {
            if (i > 1) {
              removeQuestionSetIds.push(lastQuestionSet + '_' + i);
              var tmpRemoveQuestionSet = Array();
              addMoreQuestionSet.questionSets.forEach(questionSet => {
                tmpRemoveQuestionSet.push(questionSet + '_' + i);
              });
              removeQuestionSets.push(tmpRemoveQuestionSet);
            } else {
              removeQuestionSetIds.push(lastQuestionSet);
              removeQuestionSets.push(addMoreQuestionSet.questionSets);
            }
          }
        }
        if (questionAnswers[addMoreQuestionSet.addMoreName] > 1) {
          lastQuestionSet = lastQuestionSet + '_' + questionAnswers[addMoreQuestionSet.addMoreName];
        }
        addMoreName = addMoreQuestionSet.addMoreName;
        if (lastQuestionSet === questionSetId) {
          showAddMore = true;
          addMoreButton = addMoreQuestionSet.addMoreButton;
          addMoreButtonClass = addMoreQuestionSet.addMoreButtonClass;
        }
        removeQuestionSetIndex = _.indexOf(removeQuestionSetIds, questionSetId);
        if (removeQuestionSetIndex !== -1) {
          showRemoveMore = true;
          removeMoreButton = addMoreQuestionSet.removeMoreButton;
          removeMoreButtonClass = addMoreQuestionSet.removeMoreButtonClass;
        }
      });
    }
    if (questionSetWrapper) {
      const element = questionSetWrapper.element ? questionSetWrapper.element : 'div';
      const children = <QuestionSetWrapper questionSetWrapper={questionSetWrapper.children} questionSet={questionSet} />
      return (
        React.createElement(element, {className: questionSetWrapper.className}, children)
      )
    } else {
      return (
        <React.Fragment>
          {questionSet}
          {(showAddMore || showRemoveMore) && (
            <div className="d-flex justify-content-end">
              {showAddMore && (
                <a href="javascript:;" className={addMoreButtonClass} onClick={() => this.props.onAddMore(addMoreName)}><FontAwesomeIcon icon="plus" className="fa-fw" /> {addMoreButton}</a>
              )}
              {showRemoveMore && (
                <a href="javascript:;" className={removeMoreButtonClass} onClick={() => this.props.onRemoveMore(addMoreName, originalQuestionSets, removeQuestionSetIndex, removeQuestionSets[removeQuestionSetIndex])}><FontAwesomeIcon icon="minus" className="fa-fw" /> {removeMoreButton}</a>
              )}
            </div>
          )}
        </React.Fragment>
      );
    }
  }
};

class QuestionPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      validationErrors: this.props.validationErrors
    };
  }

  handleAnswerValidate(questionId, questionAnswer, validations) {
    if (typeof validations === 'undefined'
      || validations.length === 0) {
      return;
    }

    /*
     * Run the question through its validations and
     * show any error messages if invalid.
     */
    var questionValidationErrors = [];
    validations
      .forEach(validation => {
        if (Validation.validateAnswer(questionAnswer,
          validation,
          this.props.questionAnswers)) {
          return;
        }
        if(questionValidationErrors.length === 0){
          questionValidationErrors.push({
            type: validation.type,
            message: ErrorMessages.getErrorMessage(validation)
          });
        }
      });

    var validationErrors = _.chain(this.state.validationErrors)
      .set(questionId, questionValidationErrors)
      .value();

    this.setState({
      validationErrors: validationErrors
    }, () => this.handleValidationErrors(false));
  }

  handleMainButtonClick() {
    var action = this.props.action.default;
    console.log(action);
    console.log(this.props.questionAnswers);
    var conditions = this.props.action.conditions || [];

    /*
     * We need to get all the question sets for this panel.
     * Collate a list of the question set IDs required
     * and run through the schema to grab the question sets.
     */
    var questionSetIds = this.props.questionSets.map(qS => qS.questionSetId);
    var questionSets = _.chain(this.props.schema.questionSets)
      .filter(qS => questionSetIds.indexOf(qS.questionSetId) > -1)
      .value();

    /*
     * Get any incorrect fields that need error messages.
     */
    var invalidQuestions = Validation.getQuestionPanelInvalidQuestions(
      questionSets, this.props.questionAnswers
    );

    /*
     * If the panel isn't valid...
     */
    if (Object.keys(invalidQuestions).length > 0) {
      var validationErrors = _.mapValues(invalidQuestions, validations => {
        var i = 0;
        return validations.map(validation => {
          i++;
          if(i > 1){ 
            return false; // skip
          }else {
            return {
              type: validation.type,
              message: ErrorMessages.getErrorMessage(validation)
            };
          }
        })
      });

      this.setState({
        validationErrors: validationErrors
      }, () => this.handleValidationErrors(true));
      return;
    }

    /*
     * Panel is valid. So what do we do next?
     * Check our conditions and act upon them, or the default.
     */
    conditions
      .forEach(condition => {
        var conditionMet = Array.isArray(condition.predicates)
          ? this.handleEvaluatePredicate(condition.predicates)
          : this.props.questionAnswers[condition.questionId] === condition.value;

        action = conditionMet
          ? {
            action: condition.action,
            target: condition.target,
            panel: condition.panel
          }
          : action;
      });


    /*
     * Decide which action to take depending on
     * the action decided upon.
     */
    switch (action.action) {

      case 'GOTO':
        this.props.onSwitchPanel(action.target);
        break;

      case 'SUBMIT':
        this.props.onSubmit(action.target);
        break;

      case 'SUBMIT-GOTO':
        this.props.onSubmit(action.target);
        this.props.onSwitchPanel(action.panel);
        break;
    }
  }

  handleValidationErrors(isActionAttempt) {
    const onValidationErrors = this.props.onValidationErrors;
    if (typeof onValidationErrors === 'function') {
      onValidationErrors(this.state.validationErrors, isActionAttempt);
    }
  }

  handleEvaluatePredicate(predicates) {
    return evaluatePredicates(predicates, this.props.questionAnswers);
  }

  handleBackButtonClick() {
    if (this.props.panelHistory.length == 0) {
      return;
    }

    this.props.onPanelBack();
  }

  handleAnswerChange(questionId, questionAnswer, validations, validateOn, progress) {
    this.props.onAnswerChange(questionId, questionAnswer, progress);

    this.setState({
      validationErrors: _.chain(this.state.validationErrors)
        .set(questionId, [])
        .value()
    });

    if (validateOn === 'change') {
      this.handleAnswerValidate(questionId, questionAnswer, validations);
    }
  }

  handleQuestionBlur(questionId, questionAnswer, validations, validateOn) {
    if (validateOn === 'blur') {
      this.handleAnswerValidate(questionId, questionAnswer, validations);
    }
  }

  handleInputKeyDown(e) {
    if (KeyCodez[e.keyCode] === 'enter') {
      e.preventDefault();
      this.handleMainButtonClick.call(this);
    }
  }

  render() {
    var questionSets = this.props.questionSets.map(questionSetMeta => {
      var questionSet = _.find(this.props.schema.questionSets, {
        questionSetId: questionSetMeta.questionSetId
      });

      if (!questionSet) {
        return undefined;
      }

      const questionSetComponent = <QuestionSet key={questionSet.questionSetId}
                                              id={questionSet.questionSetId}
                                              name={questionSet.name}
                                              questionSetHeader={questionSet.questionSetHeader}
                                              questionSetText={questionSet.questionSetText}
                                              questionSetHtml={questionSet.questionSetHtml}
                                              questions={questionSet.questions}
                                              classes={this.props.classes}
                                              questionSetClass={questionSet.questionSetClass}
                                              questionAnswers={this.props.questionAnswers}
                                              renderError={this.props.renderError}
                                              renderRequiredAsterisk={this.props.renderRequiredAsterisk}
                                              validationErrors={this.state.validationErrors}
                                              onAnswerChange={this.handleAnswerChange.bind(this)}
                                              onQuestionBlur={this.handleQuestionBlur.bind(this)}
                                              onKeyDown={this.handleInputKeyDown.bind(this)} />

      return (
        <QuestionSetWrapper questionSetWrapper={questionSet.questionSetWrapper} questionSet={questionSetComponent} addMoreQuestionSets={this.props.addMoreQuestionSets} onAddMore={this.props.onAddMore} onRemoveMore={this.props.onRemoveMore} questionSetId={questionSet.questionSetId} questionAnswers={this.props.questionAnswers} />
      );
    });

    function createMarkup(panelHtml) {
      return {__html: panelHtml};
    }

    return (
      <div className={this.props.classes.questionPanel}>
        {typeof this.props.panelHeader !== 'undefined'
          || typeof this.props.panelText !== 'undefined'
          || typeof this.props.panelHtml !== 'undefined'
          ? (
            <div className={this.props.classes.questionPanelHeaderContainer}>
              {typeof this.props.panelHeader !== 'undefined'
                ? (
                  <h2 className={this.props.classes.questionPanelHeaderText}>
                    <b>{this.props.panelHeader}</b>
                  </h2>
                )
                : undefined}
              {typeof this.props.panelText !== 'undefined'
                ? (
                  <p className={this.props.classes.questionPanelText}>
                    {this.props.panelText}
                  </p>
                )
                : undefined}
              {typeof this.props.panelHtml !== 'undefined'
                ? (
                <div dangerouslySetInnerHTML={createMarkup(this.props.panelHtml)} />
                )
                : undefined}
            </div>
          )
          : undefined}
        <div className={this.props.classes.questionSets + this.props.questionPanelClass}>
          {questionSets}
        </div>
        <div className={this.props.classes.buttonBar}>
          {this.props.panelHistory.length > 1
            && !this.props.backButton.disabled
            ? (
              <Button text={this.props.backButton.text || 'Back'} condition={this.props.button.condition} questionAnswers={this.props.questionAnswers}
                onClick={this.handleBackButtonClick.bind(this)}
                className={this.props.classes.backButton} />
            )
            : undefined}
          {!this.props.button.disabled
            ? (
              <Button text={this.props.button.text} condition={this.props.button.condition} questionAnswers={this.props.questionAnswers}
                onClick={this.handleMainButtonClick.bind(this)}
                className={this.props.classes.controlButton} />
            )
            : undefined}
        </div>
      </div>
    );
  }

};

QuestionPanel.defaultProps = {
  validationErrors: {},
  schema: {},
  classes: {},
  panelId: undefined,
  questionPanelClass: '',
  panelIndex: undefined,
  panelHeader: undefined,
  panelText: undefined,
  panelHtml: undefined,
  action: {
    default: {},
    conditions: []
  },
  button: {
    text: 'Submit',
    condition:{
      field: '',
      text: '',
      value: ''
    }
  },
  backButton: {
    text: 'Back'
  },
  questionSets: [],
  addMoreQuestionSets: [],
  questionAnswers: {},
  renderError: undefined,
  renderRequiredAsterisk: undefined,
  onAnswerChange: () => { },
  onSwitchPanel: () => { },
  onPanelBack: () => { },
  panelHistory: [],
};

module.exports = QuestionPanel;

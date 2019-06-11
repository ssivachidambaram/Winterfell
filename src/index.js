var React    = require('react');
var ReactDOM = require('react-dom');
var _        = require('lodash').noConflict();

var QuestionPanel = require('./questionPanel');
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPaperclip,
  faTimesCircle,
  faComment,
  faPlus,
  faMinus,
  faChevronDown,
  faChevronUp,  
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faPaperclip,
  faTimesCircle,
  faComment,
  faPlus,
  faMinus,
  faChevronDown,
  faChevronUp,
);

class Winterfell extends React.Component {

  constructor(props) {
    super(props);

    this.formComponent = null;

    this.panelHistory = [];

    var schema = _.extend({
      classes        : {},
      formPanels     : [],
      questionPanels : [],
      questionSets   : [],
    }, props.schema);
    this.schema = schema;
    schema = this.updateSchema();

    schema.formPanels = schema.formPanels
                              .sort((a, b) => a.index > b.index);

    var panelId = (typeof props.panelId !== 'undefined'
                     ? props.panelId
                     : schema.formPanels.length > 0
                         ? schema.formPanels[0].panelId
                         : undefined);

    var currentPanel = typeof schema !== 'undefined'
                         && typeof schema.formPanels !== 'undefined'
                         && typeof panelId !== 'undefined'
                         ? _.find(schema.formPanels,
                               panel => panel.panelId == panelId)
                         : undefined;

    if (!currentPanel) {
      throw new Error('Winterfell: Could not find initial panel and failed to render.');
    }

    this.state = {
      schema          : schema,
      currentPanel    : currentPanel,
      action          : props.action,
      questionAnswers : props.questionAnswers
    };
    this.updateSchema = this.updateSchema.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    var schema = this.updateSchema();
    this.setState({
      action          : nextProps.action,
      schema          : schema,
      questionAnswers : nextProps.questionAnswers
    });
  }

  updateSchema() {
    var schema = _.cloneDeep(this.schema);
    var questionAnswers = this.state ? this.state.questionAnswers : [];
    var addMoreQuestionSets = Array();
    schema.questionPanels.forEach((questionPanel, questionPanelIndex) => {
      if (questionPanel.addMoreQuestionSets) {
        questionPanel.addMoreQuestionSets.forEach((addMoreQuestionSet) => {
          var questionSetIds = Array();
          for (var i = 0; i < schema.questionSets.length; i++) {
            if (_.indexOf(addMoreQuestionSet.questionSets, schema.questionSets[i].questionSetId) !== -1) {
              questionSetIds.push(i);
            }
          }
          addMoreQuestionSets.push({
            addMoreName: addMoreQuestionSet.addMoreName,
            questionSets: addMoreQuestionSet.questionSets,
            questionSetIds: questionSetIds,
            questionPanelIndex: questionPanelIndex,
          });
        });
      }
    });
    if (addMoreQuestionSets.length) {
      addMoreQuestionSets.forEach((addMoreQuestionSet) => {
        var questionSetAddMore = questionAnswers[addMoreQuestionSet.addMoreName]
          ? questionAnswers[addMoreQuestionSet.addMoreName]
          : 1;
        var questionPanelQuestionSetIds = Array();
        for (var j = 1; j <= questionSetAddMore; j++) {
          addMoreQuestionSet.questionSetIds.forEach((questionSetId) => {
            var newQuestions = Array();
            schema.questionSets[questionSetId].questions.forEach(question => {
              var tmpQuestion = _.cloneDeep(question);
              tmpQuestion.questionId = tmpQuestion.questionId.replace('_1', '') + '_' + j;
              newQuestions.push(tmpQuestion);
            });
            if (j === 1) {
              schema.questionSets[questionSetId].questions = newQuestions;
            } else {
              var tmpQuestionSet = _.cloneDeep(schema.questionSets[questionSetId]);
              tmpQuestionSet.questionSetId = tmpQuestionSet.questionSetId + '_' + j;
              questionPanelQuestionSetIds.push(tmpQuestionSet.questionSetId);
              tmpQuestionSet.questions = newQuestions;
              schema.questionSets.push(tmpQuestionSet);
            }
          });
        }
        if (questionPanelQuestionSetIds.length) {
          var newQuestionSets = Array();
          schema.questionPanels[addMoreQuestionSet.questionPanelIndex].questionSets.forEach((questionSet) => {
            newQuestionSets.push(questionSet);
            var lastQuestionSet = addMoreQuestionSet.questionSets[addMoreQuestionSet.questionSets.length-1];
            if (questionSet.questionSetId === lastQuestionSet) {
              questionPanelQuestionSetIds.forEach((questionPanelQuestionSetId) => {
                newQuestionSets.push({
                  index: questionSet.index,
                  questionSetId: questionPanelQuestionSetId,
                });
              });
            }
          });
          schema.questionPanels[addMoreQuestionSet.questionPanelIndex].questionSets = newQuestionSets;
        }
      });
    }
    return schema;
  }

  handleAddMore(addMoreName) {
    var questionAnswers = this.state.questionAnswers;
    questionAnswers[addMoreName] = questionAnswers[addMoreName]
      ? ++questionAnswers[addMoreName]
      : 2;
    this.setState({
      questionAnswers: questionAnswers
    });
    var schema = this.updateSchema();
    this.setState({
      schema: schema
    });
  }

  handleRemoveMore(addMoreName, originalQuestionSets, removeQuestionSetIndex, removeQuestionSets) {
    var questionAnswers = this.state.questionAnswers;
    if (removeQuestionSets.length) {
      removeQuestionSets.forEach(removeQuestionSet => {
        var questionSet = _.find(this.state.schema.questionSets, {
          questionSetId: removeQuestionSet
        });
        questionSet.questions.forEach(question => {
          delete questionAnswers[question.questionId];
        });
      });
    }
    for (var i = removeQuestionSetIndex+1; i < questionAnswers[addMoreName]; i++) {
      originalQuestionSets.forEach(originalQuestionSet => {
        var questionSet = _.find(this.schema.questionSets, {
          questionSetId: originalQuestionSet
        });
        questionSet.questions.forEach(question => {
          var j = i + 1;
          questionAnswers[question.questionId + '_' + i] = (questionAnswers[question.questionId + '_' + j]) ? questionAnswers[question.questionId + '_' + j] : '';
          delete questionAnswers[question.questionId + '_' + j];
        });
      });
    }
    questionAnswers[addMoreName] = --questionAnswers[addMoreName];
    this.setState({
      questionAnswers: questionAnswers
    });
    var schema = this.updateSchema();
    this.setState({
      schema: schema
    });
  }

  handleAnswerChange(questionId, questionAnswer, progress) {
    var questionAnswers = _.chain(this.state.questionAnswers)
                           .set(questionId, questionAnswer)
                           .value();

    this.setState({
      questionAnswers : questionAnswers,
      questionId      : questionId,
      questionAnswer  : questionAnswer,
    }, this.props.onUpdate.bind(null, questionAnswers, questionId, questionAnswer, progress));
  }

  handleSwitchPanel(panelId, preventHistory) {
    var schema = this.updateSchema();
    var panel = _.find(schema.formPanels, {
      panelId : panelId
    });

    if (!panel) {
      throw new Error('Winterfell: Tried to switch to panel "'
                      + panelId + '", which does not exist.');
    }

    if (!preventHistory) {
      this.panelHistory.push(panel.panelId);
    }

    this.setState({
      currentPanel : panel
    }, this.props.onSwitchPanel.bind(null, panel));
  }

  handleBackButtonClick() {
    this.panelHistory.pop();

    this.handleSwitchPanel.call(
      this, this.panelHistory[this.panelHistory.length - 1], true
    );
  }

  handleSubmit(action) {
    if (this.props.disableSubmit) {
      this.props.onSubmit(this.state.questionAnswers, action, this.handleSwitchPanel.bind(this));
      return;
    }

    /*
     * If we are not disabling the functionality of the form,
     * we need to set the action provided in the form, then submit.
     */
    this.setState({
      action : action
    }, () => {
      if (!this.formComponent) {
        return;
      }

      this.formComponent.submit();
    });
  }

  render() {
    var currentPanel = _.find(this.state.schema.questionPanels,
                          panel => panel.panelId == this.state.currentPanel.panelId);
    var class_name = '';
    class_name = (this.state.schema.classes.questionPanels !== undefined) ? this.state.schema.classes.questionPanels : '';
    class_name = (currentPanel.questionPanelClass !== undefined) ? class_name + ' ' +currentPanel.questionPanelClass : '';
    return (
      <form method={this.props.method}
            encType={this.props.encType}
            action={this.state.action}
            ref={ref => this.formComponent = ref}
            className={this.state.schema.classes.form}>
        <div className={class_name}>
          <QuestionPanel schema={this.state.schema}
                         classes={this.state.schema.classes}
                         panelId={currentPanel.panelId}
                         panelIndex={currentPanel.panelIndex}
                         panelHeader={currentPanel.panelHeader}
                         panelText={currentPanel.panelText}
                         panelHtml={currentPanel.panelHtml}
                         action={currentPanel.action}
                         button={currentPanel.button}
                         backButton={currentPanel.backButton}
                         questionSets={currentPanel.questionSets}
                         addMoreQuestionSets={currentPanel.addMoreQuestionSets}
                         questionAnswers={this.state.questionAnswers}
                         panelHistory={this.panelHistory}
                         renderError={this.props.renderError}
                         renderRequiredAsterisk={this.props.renderRequiredAsterisk}
                         onAnswerChange={this.handleAnswerChange.bind(this)}
                         onPanelBack={this.handleBackButtonClick.bind(this)}
                         onSwitchPanel={this.handleSwitchPanel.bind(this)}
                         onSubmit={this.handleSubmit.bind(this)}
                         onValidationErrors={this.props.onValidationErrors}
                         onAddMore={this.handleAddMore.bind(this)}
                         onRemoveMore={this.handleRemoveMore.bind(this)}
            />
        </div>
      </form>
    );
  }

  componentDidMount() {
    this.panelHistory.push(this.state.currentPanel.panelId);
    this.props.onRender();
  }

};

Winterfell.inputTypes    = require('./inputTypes');
Winterfell.errorMessages = require('./lib/errors');
Winterfell.validation    = require('./lib/validation');

Winterfell.addInputType  = Winterfell.inputTypes.addInputType;
Winterfell.addInputTypes = Winterfell.inputTypes.addInputTypes;

Winterfell.addErrorMessage  = Winterfell.errorMessages.addErrorMessage;
Winterfell.addErrorMessages = Winterfell.errorMessages.addErrorMessages;

Winterfell.addValidationMethod  = Winterfell.validation.addValidationMethod;
Winterfell.addValidationMethods = Winterfell.validation.addValidationMethods;

Winterfell.defaultProps = {
  questionAnswers        : {},
  encType                : 'application/x-www-form-urlencoded',
  method                 : 'POST',
  action                 : '',
  panelId                : undefined,
  disableSubmit          : false,
  renderError            : undefined,
  renderRequiredAsterisk : undefined,
  onSubmit               : () => {},
  onUpdate               : () => {},
  onSwitchPanel          : () => {},
  onRender               : () => {}
};

module.exports = Winterfell;

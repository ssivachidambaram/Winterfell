'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fortawesomeFontawesomeSvgCore = require('@fortawesome/fontawesome-svg-core');

var _fortawesomeFreeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');

var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash').noConflict();

var QuestionPanel = require('./questionPanel');

_fortawesomeFontawesomeSvgCore.library.add(_fortawesomeFreeSolidSvgIcons.faPaperclip, _fortawesomeFreeSolidSvgIcons.faTimesCircle, _fortawesomeFreeSolidSvgIcons.faComment);

var Winterfell = (function (_React$Component) {
  _inherits(Winterfell, _React$Component);

  function Winterfell(props) {
    _classCallCheck(this, Winterfell);

    _get(Object.getPrototypeOf(Winterfell.prototype), 'constructor', this).call(this, props);

    this.formComponent = null;

    this.panelHistory = [];

    var schema = _.extend({
      classes: {},
      formPanels: [],
      questionPanels: [],
      questionSets: []
    }, props.schema);
    this.schema = schema;
    schema = this.updateSchema();

    schema.formPanels = schema.formPanels.sort(function (a, b) {
      return a.index > b.index;
    });

    var panelId = typeof props.panelId !== 'undefined' ? props.panelId : schema.formPanels.length > 0 ? schema.formPanels[0].panelId : undefined;

    var currentPanel = typeof schema !== 'undefined' && typeof schema.formPanels !== 'undefined' && typeof panelId !== 'undefined' ? _.find(schema.formPanels, function (panel) {
      return panel.panelId == panelId;
    }) : undefined;

    if (!currentPanel) {
      throw new Error('Winterfell: Could not find initial panel and failed to render.');
    }

    this.state = {
      schema: schema,
      currentPanel: currentPanel,
      action: props.action,
      questionAnswers: props.questionAnswers
    };
    this.updateSchema = this.updateSchema.bind(this);
  }

  _createClass(Winterfell, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var schema = this.updateSchema();
      this.setState({
        action: nextProps.action,
        schema: schema,
        questionAnswers: nextProps.questionAnswers
      });
    }
  }, {
    key: 'updateSchema',
    value: function updateSchema() {
      var schema = _.cloneDeep(this.schema);
      var questionAnswers = this.state ? this.state.questionAnswers : [];
      var addMoreQuestionSets = Array();
      schema.questionPanels.forEach(function (questionPanel, questionPanelIndex) {
        if (questionPanel.addMoreQuestionSets) {
          questionPanel.addMoreQuestionSets.forEach(function (addMoreQuestionSet) {
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
              questionPanelIndex: questionPanelIndex
            });
          });
        }
      });
      if (addMoreQuestionSets.length) {
        addMoreQuestionSets.forEach(function (addMoreQuestionSet) {
          var questionSetAddMore = questionAnswers[addMoreQuestionSet.addMoreName] ? questionAnswers[addMoreQuestionSet.addMoreName] : 1;
          var questionPanelQuestionSetIds = Array();
          for (var j = 1; j <= questionSetAddMore; j++) {
            addMoreQuestionSet.questionSetIds.forEach(function (questionSetId) {
              var newQuestions = Array();
              schema.questionSets[questionSetId].questions.forEach(function (question) {
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
            schema.questionPanels[addMoreQuestionSet.questionPanelIndex].questionSets.forEach(function (questionSet) {
              newQuestionSets.push(questionSet);
              var lastQuestionSet = addMoreQuestionSet.questionSets[addMoreQuestionSet.questionSets.length - 1];
              if (questionSet.questionSetId === lastQuestionSet) {
                questionPanelQuestionSetIds.forEach(function (questionPanelQuestionSetId) {
                  newQuestionSets.push({
                    index: questionSet.index,
                    questionSetId: questionPanelQuestionSetId
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
  }, {
    key: 'handleAddMore',
    value: function handleAddMore(addMoreName) {
      var questionAnswers = this.state.questionAnswers;
      questionAnswers[addMoreName] = questionAnswers[addMoreName] ? ++questionAnswers[addMoreName] : 2;
      this.setState({
        questionAnswers: questionAnswers
      });
      var schema = this.updateSchema();
      this.setState({
        schema: schema
      });
    }
  }, {
    key: 'handleRemoveMore',
    value: function handleRemoveMore(addMoreName, originalQuestionSets, removeQuestionSetIndex, removeQuestionSets) {
      var _this = this;

      var questionAnswers = this.state.questionAnswers;
      if (removeQuestionSets.length) {
        removeQuestionSets.forEach(function (removeQuestionSet) {
          var questionSet = _.find(_this.state.schema.questionSets, {
            questionSetId: removeQuestionSet
          });
          questionSet.questions.forEach(function (question) {
            delete questionAnswers[question.questionId];
          });
        });
      }
      for (var i = removeQuestionSetIndex + 1; i < questionAnswers[addMoreName]; i++) {
        originalQuestionSets.forEach(function (originalQuestionSet) {
          var questionSet = _.find(_this.schema.questionSets, {
            questionSetId: originalQuestionSet
          });
          questionSet.questions.forEach(function (question) {
            var j = i + 1;
            questionAnswers[question.questionId + '_' + i] = questionAnswers[question.questionId + '_' + j] ? questionAnswers[question.questionId + '_' + j] : '';
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
  }, {
    key: 'handleAnswerChange',
    value: function handleAnswerChange(questionId, questionAnswer, progress) {
      var questionAnswers = _.chain(this.state.questionAnswers).set(questionId, questionAnswer).value();

      this.setState({
        questionAnswers: questionAnswers,
        questionId: questionId,
        questionAnswer: questionAnswer
      }, this.props.onUpdate.bind(null, questionAnswers, questionId, questionAnswer, progress));
    }
  }, {
    key: 'handleSwitchPanel',
    value: function handleSwitchPanel(panelId, preventHistory) {
      var schema = this.updateSchema();
      var panel = _.find(schema.formPanels, {
        panelId: panelId
      });

      if (!panel) {
        throw new Error('Winterfell: Tried to switch to panel "' + panelId + '", which does not exist.');
      }

      if (!preventHistory) {
        this.panelHistory.push(panel.panelId);
      }

      this.setState({
        currentPanel: panel
      }, this.props.onSwitchPanel.bind(null, panel));
    }
  }, {
    key: 'handleBackButtonClick',
    value: function handleBackButtonClick() {
      this.panelHistory.pop();

      this.handleSwitchPanel.call(this, this.panelHistory[this.panelHistory.length - 1], true);
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(action) {
      var _this2 = this;

      if (this.props.disableSubmit) {
        this.props.onSubmit(this.state.questionAnswers, action, this.handleSwitchPanel.bind(this));
        return;
      }

      /*
       * If we are not disabling the functionality of the form,
       * we need to set the action provided in the form, then submit.
       */
      this.setState({
        action: action
      }, function () {
        if (!_this2.formComponent) {
          return;
        }

        _this2.formComponent.submit();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var currentPanel = _.find(this.state.schema.questionPanels, function (panel) {
        return panel.panelId == _this3.state.currentPanel.panelId;
      });

      return React.createElement(
        'form',
        { method: this.props.method,
          encType: this.props.encType,
          action: this.state.action,
          ref: function (ref) {
            return _this3.formComponent = ref;
          },
          className: this.state.schema.classes.form },
        React.createElement(
          'div',
          { className: this.state.schema.classes.questionPanels + currentPanel.questionPanelClass },
          React.createElement(QuestionPanel, { schema: this.state.schema,
            classes: this.state.schema.classes,
            panelId: currentPanel.panelId,
            panelIndex: currentPanel.panelIndex,
            panelHeader: currentPanel.panelHeader,
            panelText: currentPanel.panelText,
            panelHtml: currentPanel.panelHtml,
            action: currentPanel.action,
            button: currentPanel.button,
            backButton: currentPanel.backButton,
            questionSets: currentPanel.questionSets,
            addMoreQuestionSets: currentPanel.addMoreQuestionSets,
            questionAnswers: this.state.questionAnswers,
            panelHistory: this.panelHistory,
            renderError: this.props.renderError,
            renderRequiredAsterisk: this.props.renderRequiredAsterisk,
            onAnswerChange: this.handleAnswerChange.bind(this),
            onPanelBack: this.handleBackButtonClick.bind(this),
            onSwitchPanel: this.handleSwitchPanel.bind(this),
            onSubmit: this.handleSubmit.bind(this),
            onValidationErrors: this.props.onValidationErrors,
            onAddMore: this.handleAddMore.bind(this),
            onRemoveMore: this.handleRemoveMore.bind(this)
          })
        )
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.panelHistory.push(this.state.currentPanel.panelId);
      this.props.onRender();
    }
  }]);

  return Winterfell;
})(React.Component);

;

Winterfell.inputTypes = require('./inputTypes');
Winterfell.errorMessages = require('./lib/errors');
Winterfell.validation = require('./lib/validation');

Winterfell.addInputType = Winterfell.inputTypes.addInputType;
Winterfell.addInputTypes = Winterfell.inputTypes.addInputTypes;

Winterfell.addErrorMessage = Winterfell.errorMessages.addErrorMessage;
Winterfell.addErrorMessages = Winterfell.errorMessages.addErrorMessages;

Winterfell.addValidationMethod = Winterfell.validation.addValidationMethod;
Winterfell.addValidationMethods = Winterfell.validation.addValidationMethods;

Winterfell.defaultProps = {
  questionAnswers: {},
  encType: 'application/x-www-form-urlencoded',
  method: 'POST',
  action: '',
  panelId: undefined,
  disableSubmit: false,
  renderError: undefined,
  renderRequiredAsterisk: undefined,
  onSubmit: function onSubmit() {},
  onUpdate: function onUpdate() {},
  onSwitchPanel: function onSwitchPanel() {},
  onRender: function onRender() {}
};

module.exports = Winterfell;
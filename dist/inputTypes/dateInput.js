'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactDatepicker = require("react-datepicker");

var _reactDatepicker2 = _interopRequireDefault(_reactDatepicker);

var _dateFnsParseISO = require('date-fns/parseISO');

var _dateFnsParseISO2 = _interopRequireDefault(_dateFnsParseISO);

require('react-datepicker/dist/react-datepicker.css');

var React = require('react');

var DateInput = (function (_React$Component) {
  _inherits(DateInput, _React$Component);

  function DateInput(props) {
    _classCallCheck(this, DateInput);

    _get(Object.getPrototypeOf(DateInput.prototype), 'constructor', this).call(this, props);

    this.state = {
      value: this.props.value
    };
  }

  _createClass(DateInput, [{
    key: 'handleChange',
    value: function handleChange(date) {
      this.setState({
        value: date
      }, this.props.onChange.bind(null, date));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        this.setState({ value: nextProps.value }, this.props.onChange.bind(null, nextProps.value));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var format = this.props.text && this.props.text !== "" ? this.props.text : "yyyy/MM/dd";
      var selectedDate = this.state.value;
      if (selectedDate && Object.prototype.toString.call(selectedDate) === '[object String]') {
        selectedDate = (0, _dateFnsParseISO2['default'])(selectedDate);
      }
      return React.createElement(
        'div',
        { id: this.props.name },
        React.createElement(_reactDatepicker2['default'], {
          selected: selectedDate,
          onChange: this.handleChange.bind(this),
          className: this.props.classes.input,
          showMonthDropdown: true,
          showYearDropdown: true,
          dateFormat: format
        })
      );
    }
  }]);

  return DateInput;
})(React.Component);

;

DateInput.defaultProps = {
  classes: {},
  name: '',
  id: '',
  value: '',
  placeholder: '',
  onChange: function onChange() {},
  onBlur: function onBlur() {},
  onKeyDown: function onKeyDown() {}
};

module.exports = DateInput;
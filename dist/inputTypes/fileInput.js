'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _fortawesomeReactFontawesome = require('@fortawesome/react-fontawesome');

var React = require('react');

var FileInput = (function (_React$Component) {
  _inherits(FileInput, _React$Component);

  function FileInput(props) {
    _classCallCheck(this, FileInput);

    _get(Object.getPrototypeOf(FileInput.prototype), 'constructor', this).call(this, props);
    var value = this.props.value;
    if (this.props.options[0].multiple && value === '') {
      value = [];
    }
    this.state = {
      value: value,
      multiple: this.props.options[0].multiple,
      progress: 0
    };
  }

  _createClass(FileInput, [{
    key: 'handleChange',
    value: function handleChange(file, progress) {
      this.setState({
        value: file
      }, this.props.onChange.bind(null, file, progress));
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(index) {
      var temp = this.state.value;
      if (!this.state.multiple) {
        temp = '';
      } else {
        temp.splice(index, 1);
      }
      this.setState({
        value: temp,
        progress: 0
      }, this.props.onChange.bind(null, temp, 'delete:' + index));
    }
  }, {
    key: 'progressEvent',
    value: function progressEvent(_progressEvent) {
      var percentCompleted = Math.round(_progressEvent.loaded * 100 / _progressEvent.total);
      this.setState({
        progress: percentCompleted
      });
      this.forceUpdate();
    }
  }, {
    key: 'onDrop',
    value: function onDrop(files) {
      var progress = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: this.progressEvent.bind(this)
      };
      if (files.length > 0) {
        if (!this.state.multiple) {
          if (files[0].type.indexOf('image/') !== -1) {
            Object.assign(files[0], {
              preview: URL.createObjectURL(files[0])
            });
          } else {
            Object.assign(files[0], {
              filename: files[0].name
            });
          }
          this.setState({
            value: files[0]
          }, this.props.onChange.bind(null, files[0], progress));
        } else if (this.state.multiple) {
          var temp = this.state.value;
          files.forEach(function (option, index) {
            if (files[index].type.indexOf('image/') !== -1) {
              Object.assign(files[index], {
                preview: URL.createObjectURL(files[index])
              });
            } else {
              Object.assign(files[index], {
                filename: files[index].name
              });
            }
            temp.push(files[index]);
          });
          this.setState({
            value: temp
          }, this.props.onChange.bind(null, temp, progress));
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var img = {
        display: 'block',
        width: 100,
        height: 100,
        marginBottom: 10
      };
      var baseStyle = {
        width: '100%',
        height: 70,
        textAlign: 'center',
        padding: '20px 0px',
        borderWidth: 2,
        borderColor: '#666',
        borderStyle: 'dashed',
        borderRadius: 5,
        cursor: 'pointer'
      };
      var activeStyle = {
        borderStyle: 'solid',
        borderColor: '#6c6',
        backgroundColor: '#eee'
      };
      var rejectStyle = {
        borderStyle: 'solid',
        borderColor: '#c66',
        backgroundColor: '#eee'
      };
      var progressBar = {
        float: 'left',
        width: '0',
        height: '100%',
        fontSize: '12px',
        lineHeight: '20px',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#337ab7',
        WebkitBoxShadow: 'inset 0 -1px 0 rgba(0,0,0,.15)',
        boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.15)',
        WebkitTransition: 'width .6s ease',
        Otransition: 'width .6s ease',
        transition: 'width .6s ease'
      };
      var progressWrapper = {
        height: '10px',
        marginTop: '10px',
        width: '100%',
        float: 'left',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        WebkitBoxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.1)'
      };
      progressBar.width = this.state.progress + '%';
      var message = React.createElement(
        'span',
        null,
        'Uploading ...'
      );
      if (this.state.progress === 100) {
        message = React.createElement(
          'span',
          null,
          'Successfully uploaded'
        );
      }
      var oldFile = false;
      var imageFile = false;
      var files = [];
      var panels = '';
      if (this.state.value && !this.state.value.preview && !this.state.value.filename && !this.state.multiple) {
        oldFile = true;
        if (this.state.value.indexOf('.jpg') > -1 || this.state.value.indexOf('.jpeg') > -1 || this.state.value.indexOf('.png') > -1 || this.state.value.indexOf('.gif') > -1) {
          imageFile = true;
        }
        panels = '';
      }
      if (this.state.multiple) {
        if (this.state.value.length < 0) return '';
        panels = this.state.value.map(function (files, keys) {
          var oldFile = false;
          var imageFile = false;
          if (files && !files.preview && !files.filename) {
            oldFile = true;
            if (files && !files.preview && !files.filename && (files.indexOf('.jpg') > -1 || files.indexOf('.jpeg') > -1 || files.indexOf('.png') > -1 || files.indexOf('.gif') > -1)) {
              imageFile = true;
            }
          }
          return React.createElement(
            React.Fragment,
            null,
            files && files.preview && React.createElement(
              'div',
              { className: 'position-relative d-inline-block mx-2' },
              React.createElement('img', { src: files.preview, style: img }),
              React.createElement(
                'a',
                { onClick: _this.handleDelete.bind(_this, keys), className: 'position-absolute deleted' },
                ' ',
                React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
                ' '
              )
            ),
            files && files.filename && React.createElement(
              'p',
              null,
              files.filename,
              React.createElement(
                'a',
                { onClick: _this.handleDelete.bind(_this, keys) },
                ' ',
                React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
                ' '
              )
            ),
            oldFile && imageFile && React.createElement(
              'div',
              { 'class': 'position-relative d-inline-block mx-2' },
              React.createElement('img', { src: '/img/100x100,sc/' + files, style: img }),
              React.createElement(
                'a',
                { onClick: _this.handleDelete.bind(_this, keys), className: 'position-absolute deleted' },
                ' ',
                React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
                ' '
              )
            ),
            oldFile && !imageFile && React.createElement(
              'p',
              null,
              React.createElement(
                'a',
                { href: '/private_media/' + files, target: '_blank' },
                files,
                ' '
              ),
              React.createElement(
                'a',
                { onClick: _this.handleDelete.bind(_this, keys) },
                ' ',
                React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
                ' '
              )
            )
          );
        });
      }
      return React.createElement(
        'section',
        null,
        !this.state.multiple && React.createElement(
          React.Fragment,
          null,
          this.state.value && this.state.value.preview && React.createElement(
            'div',
            { className: 'position-relative d-inline-block mx-2' },
            React.createElement('img', { src: this.state.value.preview, style: img }),
            React.createElement(
              'a',
              { onClick: this.handleDelete.bind(this), className: 'position-absolute deleted' },
              ' ',
              React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
              ' '
            )
          ),
          this.state.value && this.state.value.filename && React.createElement(
            'p',
            null,
            this.state.value.filename,
            React.createElement(
              'a',
              { onClick: this.handleDelete.bind(this) },
              ' ',
              React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
              ' '
            )
          ),
          oldFile && imageFile && React.createElement(
            'div',
            { 'class': 'position-relative d-inline-block mx-2' },
            React.createElement('img', { src: '/img/100x100,sc/' + this.state.value, style: img }),
            React.createElement(
              'a',
              { onClick: this.handleDelete.bind(this), className: 'position-absolute deleted' },
              ' ',
              React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
              ' '
            )
          ),
          oldFile && !imageFile && React.createElement(
            'p',
            null,
            React.createElement(
              'a',
              { href: '/private_media/' + this.state.value, target: '_blank' },
              this.state.value,
              ' '
            ),
            React.createElement(
              'a',
              { onClick: this.handleDelete.bind(this) },
              ' ',
              React.createElement(_fortawesomeReactFontawesome.FontAwesomeIcon, { icon: 'times-circle', className: 'fa-fw' }),
              ' '
            )
          )
        ),
        this.state.multiple && React.createElement(
          React.Fragment,
          null,
          panels
        ),
        React.createElement(
          _reactDropzone2['default'],
          {
            accept: this.props.text,
            multiple: this.state.multiple,
            name: this.props.name,
            onDrop: this.onDrop.bind(this),
            onChange: this.handleChange.bind(this)
          },
          function (_ref) {
            var getRootProps = _ref.getRootProps;
            var getInputProps = _ref.getInputProps;
            var isDragActive = _ref.isDragActive;
            var isDragReject = _ref.isDragReject;
            var acceptedFiles = _ref.acceptedFiles;
            var rejectedFiles = _ref.rejectedFiles;

            var styles = _extends({}, baseStyle);
            styles = isDragActive ? _extends({}, styles, activeStyle) : styles;
            styles = isDragReject ? _extends({}, styles, rejectStyle) : styles;
            return React.createElement(
              'div',
              _extends({}, getRootProps(), { style: styles }),
              React.createElement('input', _extends({
                type: 'file',
                name: _this.props.name,
                id: _this.props.id,
                'aria-labelledby': _this.props.labelId,
                className: _this.props.classes.file,
                required: _this.props.required ? 'required' : undefined,
                onBlur: _this.props.onBlur.bind(null, _this.state.value)
              }, getInputProps())),
              React.createElement(
                'div',
                null,
                'Choose a file or drag it here...'
              ),
              isDragReject && React.createElement(
                'div',
                null,
                'Unsupported file type...'
              )
            );
          }
        ),
        this.state.progress !== 0 && React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'div',
            { style: progressWrapper },
            React.createElement('div', { style: progressBar })
          ),
          React.createElement(
            'div',
            { style: { clear: 'left' } },
            message
          )
        )
      );
    }
  }]);

  return FileInput;
})(React.Component);

FileInput.defaultProps = {
  classes: {},
  name: '',
  id: '',
  value: '',
  options: [{ 'multiple': false }],
  onChange: function onChange() {},
  onBlur: function onBlur() {}
};

module.exports = FileInput;
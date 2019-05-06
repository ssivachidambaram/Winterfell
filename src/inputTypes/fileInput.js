var React = require('react');
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    var value = this.props.value;
    if(this.props.options[0].multiple && value === ''){
      value = [];
    } 
    this.state = {
      value: value,
      multiple: this.props.options[0].multiple,
      progress: 0
    };
  }

  handleChange(file, progress) {
    this.setState(
      {
        value: file
      },
      this.props.onChange.bind(null, file, progress)
    );
  }

  handleDelete(index) {
    var temp = this.state.value;
    if(!this.state.multiple){
      temp = '';
    }else{
      temp.splice(index, 1);
    }
    this.setState(
      {
        value: temp
      },
      this.props.onChange.bind(null, temp, 'delete:'+index)
    );
  }  

  progressEvent(progressEvent) {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    this.setState({
      progress: percentCompleted
    });
    this.forceUpdate();
  }

  onDrop(files) {
    const progress = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: this.progressEvent.bind(this)
    };
    if (files.length > 0) {
      if(!this.state.multiple){
        if (files[0].type.indexOf('image/') !== -1) {
          Object.assign(files[0], {
            preview: URL.createObjectURL(files[0])
          });
        } else {
          Object.assign(files[0], {
            filename: files[0].name
          });
        }
        this.setState(
          {
            value: files[0]
          },
          this.props.onChange.bind(null, files[0], progress)
        );
      }else if(this.state.multiple){
        var temp = this.state.value;
        files.forEach((option, index) => {
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
        this.setState(
          {
            value: temp
          },
          this.props.onChange.bind(null, temp  , progress)
        );
      }
    }
  }

  render() {
    const img = {
      display: 'block',
      width: 100,
      height: 100,
      marginBottom: 10
    };
    const baseStyle = {
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
    const activeStyle = {
      borderStyle: 'solid',
      borderColor: '#6c6',
      backgroundColor: '#eee'
    };
    const rejectStyle = {
      borderStyle: 'solid',
      borderColor: '#c66',
      backgroundColor: '#eee'
    };
    const progressBar = {
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
    const progressWrapper = {
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
    progressBar.width = `${this.state.progress}%`;
    let message = <span>Uploading ...</span>;
    if (this.state.progress === 100) {
      message = <span>Successfully uploaded</span>;
    }
    let oldFile = false ;
    let imageFile = false;
    let files = [];
    let panels = '';
    if(this.state.value && !this.state.value.preview && !this.state.value.filename && !this.state.multiple){
      oldFile = true;
      if(this.state.value.indexOf('.jpg') > -1 || this.state.value.indexOf('.jpeg') > -1 || this.state.value.indexOf('.png') > -1 || this.state.value.indexOf('.gif') > -1){
        imageFile = true;
      }
      panels = '';
      }
    if(this.state.multiple){
      if(this.state.value.length < 0) return '';
      panels = this.state.value.map((files, keys) => {
        let oldFile = false ;
        let imageFile = false;
        if(files && !files.preview && !files.filename){
          oldFile = true;
          if(files && !files.preview && !files.filename && (files.indexOf('.jpg') > -1 || files.indexOf('.jpeg') > -1 || files.indexOf('.png') > -1 || files.indexOf('.gif') > -1) ){
            imageFile = true;
          }
        }     
        return (
          <React.Fragment>
            {files && files.preview && (
              <div className="position-relative d-inline-block mx-2">
                <img src={files.preview} style={img}  />
                <a onClick={this.handleDelete.bind(this, keys)} className="position-absolute deleted"> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a>
              </div>
            )}
            {files && files.filename && (
              <p>{files.filename}<a onClick={this.handleDelete.bind(this, keys)}> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a></p>
              
            )}
            {oldFile && imageFile && (
              <div class="position-relative d-inline-block mx-2">
              <img src={`/img/100x100,sc/${files}`} style={img} />
              <a onClick={this.handleDelete.bind(this, keys)} className="position-absolute deleted"> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a>
              </div>
            )}
            {oldFile && !imageFile && (
              <p>
                <a href={`/private_media/${files}`} target="_blank">{files} </a>
                <a onClick={this.handleDelete.bind(this, keys)}> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a>
              </p>
            )}
          </React.Fragment>
        );
      });
    }
    return (
      <section>
        {!this.state.multiple && (          
          <React.Fragment>
          {this.state.value && this.state.value.preview && (
            <div className="position-relative d-inline-block mx-2">
              <img src={this.state.value.preview} style={img} />
              <a onClick={this.handleDelete.bind(this)} className="position-absolute deleted"> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a>
            </div>
          )}
          {this.state.value && this.state.value.filename && (
            <p>{this.state.value.filename}<a onClick={this.handleDelete.bind(this)}> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a></p>
          )}
          {oldFile && imageFile && (
            <div class="position-relative d-inline-block mx-2">
              <img src={`/img/100x100,sc/${this.state.value}`} style={img} />
              <a onClick={this.handleDelete.bind(this)} className="position-absolute deleted"> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a>
            </div>
          )}
          {oldFile && !imageFile && (
            <p>
              <a href={`/private_media/${this.state.value}`} target="_blank">{this.state.value} </a>
              <a onClick={this.handleDelete.bind(this)}> <FontAwesomeIcon icon="times-circle" className="fa-fw" /> </a>
            </p>
          )} 
          </React.Fragment>
        )}
        {this.state.multiple && ( 
          <React.Fragment>
          {panels}
          </React.Fragment>
        )}
        <Dropzone
          accept={this.props.text}
          multiple={this.state.multiple}
          name={this.props.name}
          onDrop={this.onDrop.bind(this)}
          onChange={this.handleChange.bind(this)}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragReject,
            acceptedFiles,
            rejectedFiles
          }) => {
            let styles = { ...baseStyle };
            styles = isDragActive ? { ...styles, ...activeStyle } : styles;
            styles = isDragReject ? { ...styles, ...rejectStyle } : styles;
            return (
              <div {...getRootProps()} style={styles}>
                <input
                  type="file"
                  name={this.props.name}
                  id={this.props.id}
                  aria-labelledby={this.props.labelId}
                  className={this.props.classes.file}
                  required={this.props.required ? 'required' : undefined}
                  onBlur={this.props.onBlur.bind(null, this.state.value)}
                  {...getInputProps()}
                />
                <div>Choose a file or drag it here...</div>
                {isDragReject && <div>Unsupported file type...</div>}
              </div>
            );
          }}
        </Dropzone>
        {this.state.progress !== 0 && (
          <React.Fragment>
            <div style={progressWrapper}>
              <div style={progressBar} />
            </div>
            <div style={{ clear: 'left' }}>{message}</div>
          </React.Fragment>
        )}
      </section>
    );
  }
}

FileInput.defaultProps = {
  classes: {},
  name: '',
  id: '',
  value: '',
  options: [
    {'multiple': false}
  ],
  onChange: () => {},
  onBlur: () => {}
};

module.exports = FileInput;

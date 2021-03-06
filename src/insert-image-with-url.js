import React, {Component} from 'react';

class InsertImageWithUrl extends Component {
    constructor(props) {
        super(props);

        this.state = {
          hidden: true,
          editorSelection: {index: 0, length: 0}
        };
    }

    componentDidUpdate() {
        this.refs.url.focus();
    }

    insertImage() {
      this.props.onInsert(this.refs.url.value, this.refs.height.value, this.refs.width.value, this.state.editorSelection);
      this.refs.url.value = '';
      this.refs.height.value = '';
      this.refs.width.value = '';
    }

    handleKeyPress(e) {
      if (e.key === 'Enter') {
          this.insertImage();
      }
    }

    render() {
        return (
          <div style={{display: this.state.hidden ? 'none' : 'block'}} className='insert-image-by-url ql-snow ql-toolbar ql-tooltip'>
            URL: <input ref='url' placeholder='Required' onKeyPress={this.handleKeyPress.bind(this)} />
            Height (px): <input ref='height' size="6" placeholder='Optional' onKeyPress={this.handleKeyPress.bind(this)}/>
            Width (px): <input ref='width' size="6" placeholder='Optional' onKeyPress={this.handleKeyPress.bind(this)}/>
            <a className='ql-action' onClick={this.insertImage.bind(this)}>Insert</a>
          </div>
        );
    }
}

InsertImageWithUrl.propTypes = {
  onInsert: React.PropTypes.func.isRequired
};

module.exports = InsertImageWithUrl;

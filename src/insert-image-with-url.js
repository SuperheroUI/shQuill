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
        this.refs.input.focus();
    }

    insertImage() {
      this.props.onInsert(this.refs.input.value, this.state.editorSelection);
      this.refs.input.value = '';
    }

    handleKeyPress(e) {
      if (e.key === 'Enter') {
          this.insertImage();
      }
    }

    render() {
        return (
          <div style={{display: this.state.hidden ? 'none' : 'block'}} className='insert-image-by-url ql-snow ql-toolbar ql-tooltip'>
            <input ref='input' onKeyPress={this.handleKeyPress.bind(this)} />
            <a className='ql-action' onClick={this.insertImage.bind(this)}>Insert</a>
          </div>
        );
    }
}

InsertImageWithUrl.propTypes = {
  onInsert: React.PropTypes.func.isRequired
};

module.exports = InsertImageWithUrl;

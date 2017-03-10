'use strict';

let React = require('react'),
    ReactDOM = require('react-dom'),
    QuillMixin = require('./mixin'),
    InsertImageWithUrl = require('./insert-image-with-url'),
    T = React.PropTypes;

let find = function(arr, predicate) {
    if (!arr) {
        return;
    }
    for (let i=0; i<arr.length; ++i) {
        if (predicate(arr[i])) return arr[i];
    }
};

let QuillComponent = React.createClass({
    displayName: 'Quill',

    mixins: [ QuillMixin ],

    propTypes: {
        id: T.string,
        className: T.string,
        style: T.object,
        value: T.string,
        defaultValue: T.string,
        placeholder: T.string,
        readOnly: T.bool,
        modules: T.object,
        toolbar: T.object,
        formats: T.array,
        styles: T.oneOfType([ T.object, T.oneOf([false]) ]),
        theme: T.string,
        pollInterval: T.number,
        onKeyPress: T.func,
        onKeyDown: T.func,
        onKeyUp: T.func,
        onChange: T.func,
        onChangeSelection: T.func,
        config: T.object
    },

    /*
    Changing one of these props should cause a re-render.
    */
    dirtyProps: [
        'id',
        'className',
        'modules',
        'toolbar',
        'formats',
        'styles',
        'theme',
        'pollInterval'
    ],

    getDefaultProps: function() {
        return {
            className: '',
            theme: 'snow',
            modules: {},
            config: {
                insertImageWithUrl: false,
                stopEventPropInDynamics: false
            }
        };
    },

    /*
    We consider the component to be controlled if
    whenever `value` is bein sent in props.
    */
    isControlled: function() {
        return 'value' in this.props;
    },

    getInitialState: function() {
        return {
            value: this.isControlled()
                ? this.props.value
                : this.props.defaultValue
        };
    },

    componentWillReceiveProps: function(nextProps) {
        let editor = this.state.editor;
        // If the component is unmounted and mounted too quickly
        // an error is thrown in setEditorContents since editor is
        // still undefined. Must check if editor is undefined
        // before performing this call.
        if (editor) {
            // Update only if we've been passed a new `value`.
            // This leaves components using `defaultValue` alone.
            if ('value' in nextProps) {
                // NOTE: Seeing that Quill is missing a way to prevent
                //       edits, we have to settle for a hybrid between
                //       controlled and uncontrolled mode. We can't prevent
                //       the change, but we'll still override content
                //       whenever `value` differs from current state.
                if (nextProps.value !== this.getEditorContents()) {
                    this.setEditorContents(editor, nextProps.value);
                }
            }
            // We can update readOnly state in-place.
            if ('readOnly' in nextProps) {
                if (nextProps.readOnly !== this.props.readOnly) {
                    this.setEditorReadOnly(editor, nextProps.readOnly);
                }
            }
        }
    },

    editorSentinel: function() {
        const DYNAMICS_URL_PATTERN = /^(.*\.)?dynamics\./;
        if (DYNAMICS_URL_PATTERN.test(window.location)) {
            let qlEditors = document.getElementsByClassName('ql-editor');
            Array.prototype.forEach.call(qlEditors, function (e) {
                e.onselectstart = (evt) => { evt.stopPropagation(); }
            });
        }
    },

    componentDidMount: function() {
        let editor = this.createEditor(
            this.getEditorElement(),
            this.getEditorConfig());

        // Style the font options to match their font family
        let fontOptions = document.querySelectorAll('.ql-toolbar .ql-font.ql-picker .ql-picker-item');
        for (let i=0; i<fontOptions.length; ++i) {
            fontOptions[i].style.fontFamily = fontOptions[i].dataset.value;
        }

        this.setState({ editor:editor }, () => {
            if (this.props.value) {
                this.setEditorContents(editor, this.props.value);
            }
            if (this.props.config.stopEventPropInDynamics === true) {
                this.editorSentinel();
            }
        });
    },

    componentWillUnmount: function() {
        // NOTE: Don't set the state to null here
        //       as it would generate a loop.
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        // Check if one of the changes should trigger a re-render.
        for (let i=0; i<this.dirtyProps.length; i++) {
            let prop = this.dirtyProps[i];
            if (nextProps[prop] !== this.props[prop]) {
                return true;
            }
        }
        // Never re-render otherwise.
        return false;
    },

    /*
    If for whatever reason we are rendering again,
    we should tear down the editor and bring it up
    again.
    */
    componentWillUpdate: function() {
        this.componentWillUnmount();
    },

    componentDidUpdate: function() {
        this.componentDidMount();
    },

    getEditorConfig: function() {
        let config = {
            readOnly:     this.props.readOnly,
            theme:        this.props.theme,
            formats:      this.props.formats, // Let Quill set the defaults, if no formats supplied
            styles:       this.props.styles,
            modules:      this.props.modules,
            pollInterval: this.props.pollInterval,
            bounds:       this.props.bounds,
            placeholder:  this.props.placeholder,
        };

        // If no toolbar is passed in as a prop, use these default settings
        let defaultToolbar = {
          container: [
              [
                {'font': [
                  'Arial',
                  'Comic Sans MS',
                  'Georgia',
                  'Impact',
                  'Tahoma',
                  'Verdana',
                  'Calibri',
                  'Times New Roman'
                ]},
                {'size': ['small', 'normal', 'large', 'huge'] },
                {'align': []}
              ],
              ['bold', 'italic', 'strike', 'underline', {'color': []}, {'background': []}, 'link'],
              [{'list': 'bullet'}, {'list': 'ordered'}],
              ['image', 'clean']
          ]
        };

        config.modules.toolbar = this.props.toolbar && typeof(this.props.toolbar) === 'object' ? this.props.toolbar : defaultToolbar;

        if (this.props.config.insertImageWithUrl === true) {
            let toolbarHandlers = Object.assign({}, config.modules.toolbar.handlers, {image: this.imageHandler});
            config.modules.toolbar.handlers = toolbarHandlers;
        }

        return config;
    },

    /**
     * Override default image button behavior by prompting for a URL instead of a local file
     */
    imageHandler: function() {
      let editor = this.getEditor();
      this.refs.insertImageWithUrl.setState({
          hidden: false,
          editorSelection: editor.getSelection()
      });
    },

    getEditor: function() {
        return this.state.editor;
    },

    getEditorElement: function() {
        return ReactDOM.findDOMNode(this.refs.editor);
    },

    getEditorContents: function() {
        return this.state.value;
    },

    getEditorSelection: function() {
        return this.state.selection;
    },

    /**
     * Insert an image by URL and hide prompt to insert image by URL.
     *
     * @param  {String} url   URL of an image
     * @param  {Object} range  A Quill range, e.g. {index: 0, length: 10}
     */
    insertImage: function(url, height, width, range) {
        if (this.state.editor) {
          this.insertEmbededImageByUrl(this.state.editor, url, height, width, range);
          this.refs.insertImageWithUrl.setState({hidden: true});
        }
    },

    /*
    Renders either the specified contents, or a default
    configuration of toolbar and contents area.
    */
    renderContents: function() {
        let contents = [];
        let children = React.Children.map(
            this.props.children,
            function(c) { return React.cloneElement(c, {ref: c.ref}); }
        );

        // Add some additional UI to accept an image URL
        if (this.props.config.insertImageWithUrl === true) {
            let insertImageWithUrl = find(children, function(child) {
                return child.ref === 'insertImageWithUrl';
            });
            contents.push(insertImageWithUrl ? insertImageWithUrl : <InsertImageWithUrl ref='insertImageWithUrl' onInsert={this.insertImage} />);
        }

        let editor = find(children, function(child) {
            return child.ref === 'editor';
        });
        contents.push(editor ? editor : React.DOM.div({
            key: 'editor-' + Math.random(),
            ref: 'editor',
            className: 'sh-quill-contents',
            dangerouslySetInnerHTML: { __html:this.getEditorContents() }
        }));

        return contents;
    },

    render: function() {
        return React.DOM.div({
            id: this.props.id,
            style: this.props.style,
            className: ['sh-quill'].concat(this.props.className).join(' '),
            onKeyPress: this.props.onKeyPress,
            onKeyDown: this.props.onKeyDown,
            onKeyUp: this.props.onKeyUp,
            onChange: this.preventDefault },
            this.renderContents()
        );
    },

    onEditorChange: function(value, delta, source, editor) {
        if (value !== this.getEditorContents()) {
            this.setState({ value: value });
            if (this.props.onChange) {
                this.props.onChange(value, delta, source, editor);
            }
        }
    },

    onEditorChangeSelection: function(range, source, editor) {
        let s = this.getEditorSelection() || {};
        let r = range || {};
        if (r.length !== s.length || r.index !== s.index) {
            this.setState({ selection: range });
            if (this.props.onChangeSelection) {
                this.props.onChangeSelection(range, source, editor);
            }
        }
    },

    focus: function() {
        this.state.editor.focus();
    },

    blur: function() {
        this.setEditorSelection(this.state.editor, null);
    },

    /*
    Stop change events from the toolbar from
    bubbling up outside.
    */
    preventDefault: function(event) {
        event.preventDefault();
        event.stopPropagation();
    }
});

module.exports = QuillComponent;

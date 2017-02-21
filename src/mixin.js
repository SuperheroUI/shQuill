'use strict';

let Quill = require('quill');

let QuillMixin = {

    /**
    Creates an editor on the given element. The editor will
    be passed the configuration, have its events bound,
    */
    createEditor: function($el, config) {
        let editor = new Quill($el, config);
        this.hookEditor(editor);
        return editor;
    },

    hookEditor: function(editor) {
        // Expose the editor on change events via a weaker,
        // unprivileged proxy object that does not allow
        // accidentally modifying editor state.
        let unprivilegedEditor = this.makeUnprivilegedEditor(editor);

        editor.on('text-change', function(delta, oldDelta, source) {
            if (this.onEditorChange) {
                this.onEditorChange(
                    editor.root.innerHTML, delta, source,
                    unprivilegedEditor
                );
            }
        }.bind(this));

        editor.on('selection-change', function(range, oldRange, source) {
            if (this.onEditorChangeSelection) {
                this.onEditorChangeSelection(
                    range, source,
                    unprivilegedEditor
                );
            }
        }.bind(this));
    },

    setEditorReadOnly: function(editor, value) {
        value? editor.disable()
             : editor.enable();
    },

    /*
    Replace the contents of the editor, but keep
    the previous selection hanging around so that
    the cursor won't move.
    */
    setEditorContents: function(editor, value) {
        let sel = editor.getSelection();
        editor.pasteHTML(value || '');
        if (sel) this.setEditorSelection(editor, sel);
    },

    setEditorSelection: function(editor, range) {
        if (range) {
            // Validate bounds before applying.
            let length = editor.getLength();
            range.index = Math.max(0, Math.min(range.index, range.length-1));
            range.length = length;
        }
        editor.setSelection(range);
    },

    /**
     * Wrapper around Quill's insertEmbed used for embedding images
     * @param  {Object} editor A Quill editor
     * @param  {String} url    URL of image
     * @param  {Object} range  A Quill range, e.g. {index: 0, length: 10}
     */
    insertEmbededImageByUrl: function(editor, url, range) {
        let index = range && range.index ? range.index : 0;
        editor.insertEmbed(index, 'image', url, 'user');
    },

    /*
    Returns an weaker, unprivileged proxy object that only
    exposes read-only accessors found on the editor instance,
    without any state-modificating methods.
    */
    makeUnprivilegedEditor: function(editor) {
        let e = editor;
        return {
            getLength:    function(){ e.getLength.apply(e, arguments); },
            getText:      function(){ e.getText.apply(e, arguments); },
            getContents:  function(){ e.getContents.apply(e, arguments); },
            getSelection: function(){ e.getSelection.apply(e, arguments); },
            getBounds:    function(){ e.getBounds.apply(e, arguments); },
        };
    }
};

module.exports = QuillMixin;

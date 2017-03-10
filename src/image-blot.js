let quill = require('quill');
let BlockEmbed = quill.import('blots/block/embed');

/**
 * Extend Quill's insertEmded() to accept a height and width
 */
class ImageBlot extends BlockEmbed {
    static create(value) {
        // Backwards compatible with value being a URL string, rather than an object
        let src = value.url ? value.url : value;
        let node = super.create();
        node.setAttribute('src', src);
        node.setAttribute('height', value.height);
        node.setAttribute('width', value.width);
        return node;
    }

    static value(node) {
        return {
            url: node.getAttribute('src'),
            height: node.getAttribute('height'),
            width: node.getAttribute('width')
        };
    }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

module.exports = ImageBlot;

module.exports = require('./component');
module.exports.Mixin = require('./mixin');
let quill = require('quill');

// Use div instead of p
let Block = quill.import('blots/block');
Block.tagName = 'DIV';
quill.register(Block, true);

// Font family
let Parchment = quill.import('parchment');
let FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', {scope: Parchment.Scope.INLINE});
quill.register(FontFamilyStyle, true);

// Font size
let SizeClass = new Parchment.Attributor.Class('size', 'ql-size', {
    scope: Parchment.Scope.INLINE,
    whitelist: ['small', 'normal', 'large', 'huge']
});
quill.register(SizeClass, true);

// Extend embedded image
let ImageBlot = require('./image-blot')
quill.register(ImageBlot);

module.exports.Quill = quill;

require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');
require('./sh-quill.scss');

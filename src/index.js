module.exports = require('./component');
module.exports.Mixin = require('./mixin');
let quill = require('quill');
let Parchment = quill.import('parchment');
let Block = quill.import('blots/block');
Block.tagName = 'DIV';
let FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', {scope: Parchment.Scope.INLINE});
quill.register(FontFamilyStyle, true);
quill.register(Block, true);
module.exports.Quill = quill;

require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');
require('./sh-quill.scss');


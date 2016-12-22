module.exports = require('./component');
module.exports.Mixin = require('./mixin');
module.exports.Toolbar = require('./toolbar');
let quill = require('quill');
let Parchment = quill.import('parchment');
let FontStyle = new Parchment.Attributor.Style('size', 'font-size', {scope: Parchment.Scope.INLINE});
let FontFamilyStyle = new Parchment.Attributor.Style('font', 'font-family', {scope: Parchment.Scope.INLINE});
quill.register(FontStyle, true);
quill.register(FontFamilyStyle, true);
module.exports.Quill = quill;

require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');


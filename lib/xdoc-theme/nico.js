var path = require('path');
var pkg = require(path.join(process.cwd(), 'package.json'))
exports.package = pkg;

// {{ settings for nico
exports.theme = __dirname
console.log('theme:', __dirname)
exports.source = process.cwd()
exports.output = path.join(process.cwd(), '_site')
exports.permalink = '{{directory}}/{{filename}}.html'
exports.ignorefilter = function (filepath, subdir) {
    var extname = path.extname(filepath);
    if (extname === '.tmp' || extname === '.bak') {
        return false;
    }
    if (/\.DS_Store/.test(filepath)) {
        return false;
    }
    if (/^sea-modules/.test(subdir) &&
        /\.[md|html|psd|zip|yml]/.test(path.extname(filepath))) {
        return false;
    }
    if (/^spm_modules/.test(subdir) &&
        /\.[md|html|psd|zip|yml]/.test(path.extname(filepath))) {
        return false;
    }
    if (/^xlib/.test(subdir) &&
        /\.[md|html|psd|zip|yml]/.test(path.extname(filepath))) {
        return false;
    }
    if (/\d+\.\d+\.\d+/.test(subdir) &&
        /\.[md|html|psd|zip|yml]/.test(path.extname(filepath))) {
        return false;
    }
    if (/^(_site|_theme|node_modules|\.idea)/.test(subdir)) {
        return false;
    }
    return true;
}
exports.writers = [
    'xnico.PageWriter',
    'xnico.StaticWriter',
    'xnico.FileWriter',
    'xnico.MochaWriter'
];
// end settings }}

// extends for theme usage, that can be accessable by {{config.xxx}}
//todo 后期修改为互秀的
exports.assets_host = 'http://localhost:8080';

exports.filters = {};

exports.isCssModule = (function () {
    // 名称若恰好为 stylib
    if (pkg.family === 'alice' || pkg.name === 'stylib') {
        return true
    }
    // output 中全是样式才用 alice
    //var output = pkg.spm.output
    //if (output) {
    //    for (var i in output) {
    //        var f = output[i]
    //        if (!/\.(css|stylus|less)$/.test(f)) return false
    //    }
    //} else {
    //    return true
    //}
    return true
})();

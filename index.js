var path = require('path');
var spmrc = require('spmrc');
var init = require('./lib/init');
var spawn = require('win-spawn');
var nico = require('xnico');
var DOC_PATH = '_site', pkg;
var build = require('./lib/build');

//try {
//  var spm = require('spm');
//} catch (e) {
//  console.log(' You need install spm first');
//  process.exit(2);
//}
var spmrc = require('spmrc');

module.exports = function (commander, callback) {

    var log = require('xnico/lib/sdk/log');
    commander.color = true;
    log.config(commander);

    callback = callback || function () {
    };

    //try {
    //  pkg = require(path.resolve('package.json'));
    //  pkg.spm.output;
    //} catch(e) {
    //  console.log(  'Check if package.json and "spm" key existed.');
    //  process.exit();
    //}

    commander.config = getThemePath();

    if (commander.init) {
        init.init();
    }


    if (commander.clean) {
        cleanDoc();
    }

    if (commander.build) {

        //处理依赖打包

        if(! commander.withoutpre){
            build();
        }
        nico.build(commander, callback);
    }

    if (commander.server || commander.watch) {
        commander.port = commander.port || 8000;
        if(! commander.withoutpre){
            nico.server(build,commander);
        }else{
            nico.server(function(){},commander);
        }
    }

    if (commander.publish) {
        // spm 和 nico 同时用到了 source ，这里只给 spm 用
        var source = commander.source || 'default';
        commander.source = '';
        cleanDoc();
        nico.build(commander);
        spawn('spm', ['publish', '--doc', DOC_PATH, '-s', source], {stdio: 'inherit'});
    }

};

function getThemePath() {
    return path.join(
        spmrc.get('user.home'),
        '.spm/themes/xdoc/nico.js'
    );
}

function cleanDoc() {
    spawn('rm', ['-rf', DOC_PATH]);
}

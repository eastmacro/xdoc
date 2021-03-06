var fs = require('fs');
var path = require('path');
var spmrc = require('spmrc');
var spawn = require('win-spawn');
var file = require('./file');

/*
Get themes directory
*/

var homeDir = process.env.HOME || process.env.USERPROFILE;
if (!homeDir) {
  homeDir = process.env.HOMEDRIVE + process.env.HOMEPATH;
}
var defaultDir = path.join(homeDir, '.spm', 'themes');
var thmemsDir = defaultDir.replace(/^~/, homeDir) + '/xdoc';
var initDir = exports.initDir = (spmrc.get('init.template') || defaultDir).replace(/^~/, homeDir);


exports.gitInstall = function (url, dest) {
  mkThemesDir();
  dest = dest.replace('~', spmrc.get('user.home'));
  file.copyDir(url,dest);
  //return spawn('cp',['-rf',url,dest],{stdio: 'inherit'});
  //if (!fs.existsSync(dest)) {
  //  return spawn('git', ['clone', url, dest], {stdio: 'inherit'});
  //} else {
  //  return spawn('git', ['pull', 'origin', 'master'], {stdio: 'inherit', 'cwd': dest});
  //}
};

/*
Mkdirp
*/

function mkThemesDir() {
  if (fs.existsSync(thmemsDir)) return;

  var arr = thmemsDir.split(path.sep);
  for (var i = 2, l = arr.length; i <= l; i++) {
    var p = arr.slice(0, i).join(path.sep);
    if (fs.existsSync(p)) continue;
    fs.mkdirSync(p);
  }
};

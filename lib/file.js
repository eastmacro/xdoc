var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var rimraf = require('rimraf');

var file = module.exports = {};

file.isroot = function(str, platform) {
  if ((platform || process.platform) === 'win32') {
    return path.normalize(str).slice(1, 3) === ':\\';
  } else {
    return str.charAt(0) === '/';
  }
};

file.abspath = function(str) {
  if (!file.isroot(str)) {
    return path.normalize(path.join(process.cwd(), path.normalize(str)));
  }
  return str;
};

file.exists = function(filepath) {
  return fs.existsSync(filepath);
};

file.cleanpath = function(filepath) {
  var fpath = path.relative(process.cwd(), filepath);
  return unixifyPath(fpath);
};

file.contain = function(base, filepath) {
  return path.relative(base, filepath).charAt(0) !== '.';
};

file.mkdir = function(dirpath, mode) {
  // get from grunt.file
  if (fs.existsSync(dirpath)) return;

  if (!mode) {
    mode = parseInt('0777', 8) & (~process.umask());
  }
  dirpath.split(path.sep).reduce(function(parts, part) {
    parts += part + '/';
    var subpath = path.resolve(parts);
    if (!fs.existsSync(subpath)) {
      fs.mkdirSync(subpath, mode);
    }
    return parts;
  }, '');
};

file.recurse = function recurse(rootdir, callback, subdir, filter) {
  if (_.isFunction(subdir)) {
    filter = subdir;
    subdir = null;
  }
  var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
  fs.readdirSync(abspath).forEach(function(filename) {
    var filepath = path.join(abspath, filename);
    if (fs.statSync(filepath).isDirectory()) {
      recurse(rootdir, callback, unixifyPath(path.join(subdir || '', filename)), filter);
    } else {
      callback(unixifyPath(filepath), rootdir, subdir, filename);
    }
  });
};

file.list = function(src, filter) {
  var files = [];
  file.recurse(src, function(filepath) {
    files.push(filepath);
  }, filter);
  return files;
};

file.read = function(filepath) {
  return fs.readFileSync(filepath, 'utf8');
};

file.readJSON = function(filepath) {
  try {
    return JSON.parse(file.read(file.abspath(filepath)));
  } catch (e) {
    return null;
  }
};

file.writeJSON = function(filepath, data) {
  file.write(filepath, JSON.stringify(data, null, 2));
};

file.write = function(filepath, content) {
  file.mkdir(path.dirname(filepath));
  return fs.writeFileSync(filepath, content);
};

file.copy = function(src, dest, filter) {

  var copy = function(src, dest) {
    var buf = fs.readFileSync(src);
    file.mkdir(path.dirname(dest));
    fs.writeFileSync(dest, buf);
  };
  if (file.stat(src).isFile()) {
    copy(src, dest);
    return;
  }
  file.recurse(src, function(filepath) {
    var destfile = path.join(dest, path.relative(src, filepath));
    copy(filepath, destfile);
  }, filter);
};

file.rmdir = function(src) {

  if (file.exists(src)) {
    rimraf.sync(src);
  }
};

file.stat = function(filepath) {
  return fs.statSync(filepath);
};

file.require = function(item) {
  if (!_.isString(item)) return item;

  var basename = path.basename(item);
  var bits = basename.split('.');
  var directory = path.dirname(item);
  if (directory.slice(0, 2) === './') {
    directory = path.join(process.cwd(), directory);
  }
  var module = require(path.join(directory, _.first(bits)));
  bits = bits.slice(1);
  if (!_.isEmpty(bits)) {
    bits.forEach(function(bit) {
      module = module[bit];
    });
  }
  return module;
};

file.isEmptyDir = function(dir) {
  return fs.readdirSync(dir).length <= 0;
};

function unixifyPath(filepath) {
  if (process.platform === 'win32') {
    return filepath.replace(/\\/g, '/');
  }
  return filepath;
}

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var stat = fs.stat;
var copyDir = function( src, dst ){
  // 读取目录中的所有文件/目录
  fs.readdir( src, function( err, paths ){
    if( err ){
      throw err;
    }
    paths.forEach(function( path ){
      var _src = src + '/' + path,
          _dst = dst + '/' + path,
          readable, writable;
      stat( _src, function( err, st ){
        if( err ){
          throw err;
        }
        // 判断是否为文件
        if( st.isFile() ){
          // 创建读取流
          readable = fs.createReadStream( _src );
          // 创建写入流
          writable = fs.createWriteStream( _dst );
          // 通过管道来传输流
          readable.pipe( writable );
        }
        // 如果是目录则递归调用自身
        else if( st.isDirectory() ){
          exists( _src, _dst, copyDir );
        }
      });
    });
  });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
  fs.exists( dst, function( exists ){
    // 已存在
    if( exists ){
      callback( src, dst );
    }
    // 不存在
    else{
      fs.mkdir( dst, function(){
        callback( src, dst );
      });
    }
  });
};
file.copyDir = copyDir;


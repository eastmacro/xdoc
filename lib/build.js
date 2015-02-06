/**
 * Created by nanwei on 15-2-2.
 */
var requirejs = require('requirejs');
var file = require('./file');
var path = require('path');
var _ = require('lodash');
var handlebars = require('handlebars');


function build() {

    var pkg = require(path.resolve('package.json'));
    var version = pkg.version;
    var main = pkg.main;
    var dep = pkg.dependencies;
    var exclude = [];
    var name = pkg.name;

    _.forEach(dep,function(v,k){
        exclude.push(k+'/'+v+'/src/'+k);
    });

    //css处理
    function precss(filePath){
        if(file.exists(filePath)){
            var css = file.read(filePath);
            file.write("build/"+name+".css",css);
        }
    }
    precss("src/"+name+".css");

    //模板预编译
    function precom(filePath){
        if(file.exists(filePath)) {
            var content = file.read(filePath);
            var code = handlebars.precompile(content);
            var result = "define('" + name + "/" + version + "/src/" + name + "_tpl',['handlebars/2.0.0/src/handlebars'],function(Handlebars){return Handlebars.template(" +
                code + ")})";
            file.write("src/" + name + "_tpl.js", result);
        }
    }
    precom("src/"+name+".hbs");
    precom("src/"+name+".handlebars");

    if (!name) {
        console.error("name为空，请检查配置package.json main 配置");
        throw new Error("name为空，请检查配置package.json main 配置");
    }
    var config = {
        //mainConfigFile:"../../../static/require-config.js",
        baseUrl: "../../",
        exclude: exclude,
        optimize: 'none',
        //paths:{
        //    src: "build",
        //    build: name +'/'+ version +'/src'
        //},
        name:name +'/'+ version + "/src/"+name,
        out: 'build/' + name + '.js'
    };

    requirejs.optimize(config, function (buildResponse) {
        //buildResponse is just a text output of the modules
        //included. Load the built file for the contents.
        //Use config.out to get the optimized file contents.
        //var contents = fs.readFileSync(config.out, 'utf8');
    }, function (err) {
        //optimization err callback
        console.error(err);
    });

}

//var config = {
//    baseUrl: '../src/scripts',
//    name: 'main',
//    out: '../build/main-built.js'
//};
//
//requirejs.optimize(config, function (buildResponse) {
//    //buildResponse is just a text output of the modules
//    //included. Load the built file for the contents.
//    //Use config.out to get the optimized file contents.
//    var contents = fs.readFileSync(config.out, 'utf8');
//}, function(err) {
//    //optimization err callback
//    console.error(err);
//});


module.exports = build;


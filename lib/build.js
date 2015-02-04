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

    if(file.exists("src/"+name+".hbs")){
        var content = file.read("src/"+name+".hbs");
        var preContent = handlebars.precompile(content);
        var code = handlebars.precompile(content);
        var result = "define('"+ name + "/"+version+"/src/"+ name+"_tpl',[],function(){return "+
                code + "})";
        file.write("src/"+name+"_tpl.js",result);
    }

    if (!name) {
        console.error("name为空，请检查配置package.json main 配置");
        throw new Error("name为空，请检查配置package.json main 配置");
    }
    var config = {
        baseUrl: "../../",
        exclude: exclude,
        paths:{
            src: "build",
            build: name +'/'+ version +'/src'
        },
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


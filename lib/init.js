#!/usr/bin/env node
/**
 * Created by nanwei on 14-11-9.
 */

var path = require('path');
var gulp = require('gulp');
var commander = require('commander');
var inquirer = require('inquirer');
var gulpTemplate = require('gulp-template');
var semver = require('semver');
var spmrc = require('spmrc');
var color = require('colorful').color;
var helper = require('../lib/helper');
var file = require('./file');
var fs = require('fs');
var exists = require('fs').existsSync;


/*
 template directory
 */
var homeDir = process.env.HOME || process.env.USERPROFILE;
if (!homeDir) {
    homeDir = process.env.HOMEDRIVE + process.env.HOMEPATH;
}
var defaultTemplate = path.dirname(__dirname) + '/lib/template/';
var template = exports.template = (spmrc.get('init.template') || defaultTemplate).replace(/^~/, homeDir);

var NAME_REGEX = require('./iduri').NAME_REGEX;




//if (commander.upgrade) {
//    helper.gitInstall('git://github.com/spmjs/template-cmd.git', template);
//    return;
//}



/*
 fetch template if not exist
 */


/*
 run grunt init task
 */

//function runTask() {
//
//    console.log(__dirname);
//    grunt.task.loadTasks(path.join(__dirname, '../node_modules/grunt-init/tasks'));
//    // fix windows directory by replace C:\ to C\:\
//    console.log(2);
//    var taskName = 'init:' + template.replace(/^([a-zA-Z]):\\/, '$1\\:\\');
//    grunt.cli.tasks = [taskName];
//    console.log(taskName);
//    grunt.cli({});
//}

function runTask() {
    console.log(template);
    console.log(process.cwd());

    //if (!file.isEmptyDir(process.cwd())) {
    //    console.warn(color.yellow('Existing files here, please run init command in an empty folder!'));
    //    return;
    //}

    console.log('Creating a spm package: ');
    inquirer.prompt([{
        message: 'Package name',
        name: 'name',
        default: path.basename(process.cwd()),
        validate: function(input) {
            var done = this.async();
            if (!NAME_REGEX.test(input)) {
                console.warn(color.red('Must be only lowercase letters, numbers, dashes or dots, and start with lowercase letter.'));
                return;
            }
            done(true);
        }
    }, {
        message: 'Version',
        name: 'version',
        default: '0.0.0',
        validate: function(input) {
            var done = this.async();
            if (!semver.valid(input)) {
                console.warn(color.red('Must be a valid semantic version (semver.org).'));
                return;
            }
            done(true);
        }
    }, {
        message: 'Description',
        name: 'description'
    }, {
        message: 'Author',
        name: 'author',
        default: require('whoami')
    }], function( answers ) {
        console.log(answers);
        answers.varName = answers.name.replace(/\-(\w)/g, function(all, letter){
            return letter.toUpperCase();
        });
        answers.yuanUrl = '1112';

        console.log(answers);
        console.log(path.join(template, '**'));

        gulp.src(path.join(template, '**'), { dot: true })
            .pipe(gulpTemplate(answers))
            .pipe(gulp.dest('./'))
            .on('end', function() {
                console.log(path.join('./'));

                //https://github.com/npm/npm/issues/1862
                fs.renameSync('./gitignore', './.gitignore');
                fs.renameSync('./src/index.js','./src/'+answers.varName+'.js');
                //fs.renameSync('./spmignore', './.spmignore');
                //fs.renameSync('./travis.yml', './.travis.yml');

                console.log(color.green('Initialize a spm package Succeccfully!'));
            });
    });
}




function init(){
    //console.log('init',template);
    //if (!exists(template)) {
    //    helper.gitInstall('https://github.com/spmjs/template-cmd', template)
    //        .on('close', runTask);
    //} else {
        runTask();
    //}
}


exports.init = init;

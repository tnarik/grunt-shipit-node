'use strict';

var async = require('async');
var path = require('path');

module.exports = function(grunt) {
  grunt.registerTask('npm:install', 'Shipit task for Node applications: remotely installs project dependencies in a shared folder, which is symlinked', function(){
    // Tell Grunt this task is asynchronous.
    var done = this.async();
    
    grunt.log.writeln('Attempting installation of modules')

    // injection of the sharedPath in shipit
    if (!grunt.shipit.sharedPath) grunt.shipit.sharedPath = path.join(grunt.shipit.config.deployTo, 'shared');

    // execution of the task without a publish
    if (!grunt.shipit.currentPath) grunt.shipit.currentPath = path.join(grunt.shipit.config.deployTo, 'current');


    var currentPackageJSONPath =  path.join(grunt.shipit.currentPath, 'package.json');
    var sharedNodeModulesPath =  path.join(grunt.shipit.sharedPath, 'node_modules');
    //async.series([
    grunt.shipit.remote('mkdir -p '+grunt.shipit.sharedPath+' && cd '+grunt.shipit.sharedPath+' && cp '+currentPackageJSONPath+' . && npm install && ln -fs '+sharedNodeModulesPath+' '+grunt.shipit.currentPath, function(err, stdout) {
      if(err) done(err)
    //  })
    //], function (err) {
    //  if (err) return done(err);
      grunt.log.oklns('Node modules installed.');
      done()
    })
  })

  grunt.registerTask('deploy:restart', 'Shipit task for Node applications: remotely restarts the engine', function(){
    // Tell Grunt this task is asynchronous.
    var done = this.async();

    // execution of the task without a publish
    if (!grunt.shipit.currentPath)  grunt.shipit.currentPath = path.join(grunt.shipit.config.deployTo, 'current');

    var currentRestartPath =  path.join(grunt.shipit.currentPath, 'tmp');
    var currentRestartFilePath =  path.join(currentRestartPath, 'restart.txt');
    //async.series([
    grunt.shipit.remote('mkdir -p '+currentRestartPath+' && touch '+currentRestartFilePath, function(err, stdout) {
      if(err) done(err)
    //  })
    //], function (err) {
    //  if (err) return done(err);
      grunt.log.oklns('Restart scheduled.');
      done()
    })
  })

  grunt.shipit.on("cleaned", function(){
     if (grunt.shipit.config.node){
      grunt.log.writeln('grunt-shipit-node installed and enabled')
      grunt.task.run(['npm:install', 'deploy:restart']);
    }
  })
}
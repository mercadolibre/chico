/*
 * grunt-git-deploy
 * https://github.com/iclanzan/grunt-git-deploy
 *
 * Copyright (c) 2013 Sorin Iclanzan
 * Licensed under the MIT license.
 */

'use strict';

var path = require("path");

module.exports = function(grunt) {
  var file = grunt.file;
  var spawn = grunt.util.spawn;

  grunt.registerMultiTask('git_deploy', 'Push files to a git remote.', function() {
    // Merge task options with these defaults.
    var options = this.options({
      message: 'autocommit',
      branch: 'gh-pages'
    });

    if (!options.url) {
      grunt.fail.warn('The URL to a remote git repository is required.');
      return false;
    }

    var src = this.filesSrc[0];

    if (!file.isDir(src)) {
      grunt.fail.warn('A source directory is needed.');
      return false;
    }

    function git(args) {
      return function(cb) {
        grunt.log.writeln('Running ' + args.join(' ').green);
        spawn({
          cmd: 'git',
          args: args,
          opts: {cwd: src}
        }, cb);
      };
    }

    grunt.file.delete(path.join(src, '.git'));

    var done = this.async();

    grunt.util.async.series([
      git(['init']),
      git(['checkout', '--orphan', options.branch]),
      git(['add', '--all']),
      git(['commit', '--message="' + options.message + '"']),
      git(['push', '--prune', '--force', '--quiet', options.url, options.branch])
    ], done);

  });
};


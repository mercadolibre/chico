# grunt-git-deploy

> Deploy files to any branch of any remote git repository.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-git-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-git-deploy');
```

## The "git_deploy" task

### Overview
The way this task works is it creates an empty git repository in the `src` directory you specify, creates an orphan branch and commits all files from that directory to it. Then it pushes the branch to the configured remote repository. **Be careful as this destroys the history of the remote branch.**

In your project's Gruntfile, add a section named `git_deploy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  git_deploy: {
    your_target: {
      options: {
        url: 'git@github.com:example/repo.git'
      },
      src: 'directory/to/deploy'
    },
  },
})
```

### Options

#### options.url
Type: `String`

The URL to a remote git repository. This option is required.

#### options.branch
Type: `String`
Default value: `'gh-pages'`

The branch to push to.

#### options.message
Type: `String`
Default value: `'autocommit'`

Commit message.

## Contributing
If you can think of a way to unit test this plugin please take a shot at it.

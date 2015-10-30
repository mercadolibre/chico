# Chico UI  ![Get things done, quickly.](http://isitmaintained.com/badge/resolution/mercadolibre/chico.svg "Get things done, quickly.")

Chico UI is a free and open source collection of easy-to-use UI components for designers and developers.


> Get things done, quickly.

## Installing

Using bower:

```bash
$ bower install chico
```

Using npm:

```bash
$ npm install chico
```

## Development setup

1. Install [Git](http://git-scm.com/), [NodeJS](http://nodejs.org/) and [Sass](http://sass-lang.com/install), requires Sass v3.4.x or above.
2. Open your terminal and clone `mercadolibre/chico` by running:

        $ git clone git@github.com:mercadolibre/chico.git

3. Now go to the project's folder:

        $ cd chico

4. Install its dependencies:

        $ npm install

5. Install `grunt-cli`:

        $ npm install grunt-cli -g

6. Install `BrowserSync`:

        $ npm install browser-sync -g

7. Run dev task

        $ grunt dev

    [http://localhost:3040](http://localhost:3040/) will open in a default browser. Mobile version is located at [http://localhost:3040/mobile](http://localhost:3040/mobile).

8. Develop! :)

**NOTE**

Please read through our code style guides:
- [HTML](https://github.com/mercadolibre/html-style-guide)
- [CSS](https://github.com/mercadolibre/css-style-guide)
- [SASS] (https://github.com/mercadolibre/ui-sass_style_guide)
- [JavaScript](https://github.com/mercadolibre/javascript-style-guide)

## API Doc

You can read our [API Doc](http://chico.mercadolibre.com/).

The API doc may also be run locally by running:

    grunt doc

Navigate `./doc` directory and enjoy!

## How to use Chico Themes

This is the structure and a small file reference guide:

### Base folder (chico/src)

In the "src" folder you'll find all Sass files. From here you can may make changes that affect the UI project in a fast and organized way.

```
src/
|
|– mobile/ # Properties only for Mobile 
|   |
|   |– styles/ # Components list
|       |– _autocomplete.scss  # Autocomplete rules
|       |– _base.scss          # Base rules
|       |– _boxes.scss         # Boxes rules
|       `– mobile-theme.scss   # Imports the components to show
|       ...                    # Etc…
|   
|– shared/ # Properties shared in Mobile and UI
|   |
|   |– styles/ # Components list
|       |– _autocomplete.scss  # Autocomplete rules
|       |– _base.scss          # Base rules
|       |– _boxes.scsss        # Boxes rules
|       ...                    # Etc…
|       |
|       `– _variables.scss  # Shared theme and structure variables
|
`– ui/ # Properties only for Desktop Browsers
    |
    `– styles/ # Components list
        |– _autocomplete.scss  # Autocomplete rules
        |– _badges.scss        # Badges rules
        |– _base.scss          # Base rules
        |– ui-theme.scss       # Imports the components to show
        ...                    # Etc…
```

### Styles folder (inside mobile, shared or ui)

This folder have a list of each individual component, within each are there unique properties.

Note:

mobile-theme.scss and ui-theme.scss these files are used to choose which components we have available at the final css. You can also edit the file and choose which components you want to render.

### Reset.scss

This file is very important because it handles all the basic css definitions, such as font-family, color, etc...

### Components structure

Example:

```
            _autocomplete.scss
            `– _autocomplete-variables.scss  # Local component's only variables
```

In the example, the first Sass file (_autocomplete.scss) imports the Sass file from the same folder (_autocomplete-variables.scss ) and includes the extra custom properties of the component.

### How to create a new theme

  * Install `Chico UI` via bower using `bower install chico#>=1.2.0`
  * Install `bourbon` via bower using `bower install bourbon`
  * Create a theme folder and put a theme file into. E.g. `mkdir mytheme && touch mytheme/mytheme-ui.scss`
  * Edit the `mytheme/mytheme-ui.scss` and put into a minimal required content

```
@import 'bourbon';
@import '../bower_components/chico/src/shared/styles/mixins';
@import '../bower_components/chico/src/shared/styles/variables';
```

  * Import all required components

```
...
@import '../bower_components/chico/src/shared/styles/icons';
...
```

  * Compile a theme. The fastest way is using a `sass` command line tool

```sass -I ./bower_components/bourbon/app/assets/stylesheets/ mytheme/mytheme-ui.scss mytheme/mytheme-ui.css```

Strictly recommended to use some task runner such `grunt` or `gulp`. Typical gulp task may look like

```js
gulp.task('sass:ui', function () {
    return gulp.src('mytheme/mytheme-ui.scss')
        .pipe($.sass({
            includePaths: [
                'bower_components/bourbon/app/assets/stylesheets/',
                './'
            ]
        }))
        .pipe(gulp.dest('mytheme/'));
});
```
  * If you are not interested in components personalization and just want to override default theme's variables
    typical theme file may look like this

```
// File that contain all overrides
@import 'settings';
// Default theme with all components
@import '../bower_components/chico/src/ui/styles/ui-theme';
```

**Note**: Variables reference is pending


## Tests
You can run all tests in a terminal with a PhantomJS headless browser:

    $ npm test

Tests are executing using the karma test runner so feel free to run them in your favorite browser. There is the example
  for Google Chrome:

    ./node_modules/.bin/karma start --browsers Chrome


## Get in touch

- E-mail: [chico at mercadolibre dot com](mailto:chico@mercadolibre.com)
- Twitter: [@chicoui](https://twitter.com/chicoui)
- Web: http://chico-ui.com.ar/

## Maintained by

- Her Mammana ([@hmammana](https://twitter.com/hmammana))
- Lean Linares ([@lean8086](https://twitter.com/lean8086))

## Thanks to

- Guille Paz ([@pazguille](https://twitter.com/pazguille)).
- Natan Santolo ([@natos](https://twitter.com/natos)). Creator and former leader, now traveling around the world, drinking beer and looking for the secret of eternal life.
- Nati Devalle ([@taly](https://twitter.com/taly)). Because we love her. She is awesome!


## Credits

![MercadoLibre](http://static.mlstatic.com/org-img/chico/img/logo-mercadolibre-new.png)

## License
Licensed under the MIT license.

Copyright (c) 2015 [MercadoLibre](http://github.com/mercadolibre).

# Chico UI

Chico UI is a free and open source collection of easy-to-use UI components for designers and developers.

Get things done, quickly.

## Development setup

1. Install [Git](http://git-scm.com/) and [NodeJS](http://nodejs.org/).
2. Open your terminal and clone `mercadolibre/chico` by running:

        $ git clone git@github.com:mercadolibre/chico.git

3. Now go to the project's folder:

        $ cd chico

4. Install its dependencies:

        $ npm install

5. Install `grunt-cli`:

        $ npm install grunt-cli -g

6. Install [sass](http://sass-lang.com/install).

7. Install [bourbon](http://bourbon.io/).

8. Install [browser-sync](http://www.browsersync.io/).

9. Run a local web server:

        $ npm start

10. Run watch tasks

        $ grunt sync

    Navigate [http://localhost:3040](http://localhost:3040/) and [http://localhost:3040/mobile](http://localhost:3040/mobile).

10. Develop! :)

**NOTE**

Please read through our code style guides:
- [HTML](https://github.com/mercadolibre/html-style-guide)
- [CSS](https://github.com/mercadolibre/css-style-guide)
- [SASS] (https://github.com/mercadolibre/ui-sass_style_guide)
- [JavaScript](https://github.com/mercadolibre/javascript-style-guide)

## API Doc

You can read our [API Doc](http://chico.mercadolibre.com/).

The API doc may also be run locally by running:

    grunt doc -env=ui
    grunt doc -env=mobile

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
|   |– css/ # Components list
|       |– _autocomplete.scss  # Autocomplete rules
|       |– _base.scss          # Base rules
|       |– _boxes.scss         # Boxes rules
|       `– mobile-theme.scss   # Imports the components to show
|       ...                    # Etc…
|   
|– shared/ # Properties shared in Mobile and UI
|   |
|   |– css/ # Components list
|       |– _autocomplete.scss  # Autocomplete rules
|       |– _base.scss          # Base rules
|       |– _boxes.scsss        # Boxes rules
|       ...                    # Etc…
|       |
|       `- common/ # Common shared skin and structure variables
|           `– _variables-ml.scss  # Common shared skin and structure variables for ML
|
`– ui/ # Properties only for Desktop Bowsers
    |
    `– css/ # Components list
        |– _autocomplete.scss  # Autocomplete rules
        |– _badges.scss        # Badges rules
        |– _base.scss          # Base rules
        |– ui-theme.scss       # Imports the components to show
        ...                    # Etc…
```

### Css folder (inside mobile, shared or ui)

This folder have a list of each individual component, within each are there unique properties.

Note:

mobile-ml.scss and ui-ml.scss these files are used to choose which components we have available at the final css. You can also edit the file and choose wich components you want to render.

### Common folder

Inside this folder (src/shared/css/common) you will find the sass file that is shared between Mobile and UI. From here you can change the main variables in Moblie and UI interface.

### Reset.scss

This file is very important becouse it handles all the basic css definition, such as font-familiy, color,etc...

### Components structure

Example:

```
            _autocomplete.scss
            autocomplete/
                `– _autocomplete-variables-ml.scss  # Extra custom properties
```

In the example, the first Sass (_autocomplete.scss) invokes the Sass file in a folder (_autocomplete-variables-ml.scss ) and includes the extra custom propieties on the component.

### How to create a new skin

#### 1. Create your own commons shared variables

a. Duplicate the commons shared variables (src/common/_variables-ml.scss).
b. Change the name of the duplicated file(s) as you want (For example, _variables-yourThemeName.scss.)

#### 2. Create your own style for a components variables

a. Duplicate the Sass components variables you need and follow the components structure explained above (or create a new one).
b. Change the name of the duplicated file(s).

> E.g.: _autocomplete-variables-ml.scss to _autocomplete-variables-yourThemeName.scss

> If the component does not have a folder, create this with the same name of the component and next, create the custom variables file.

#### 3. Update and invoque the new theme elements

a. Open mobile-theme.scss or ui-theme.scss (depending of wich framework you've been working at). Both files are inside de src/mobile/css or src/ui/scc folders
b. Once there, update the name of the variable file with the one you've created. If you've change de boxes component, simply change the _boxes-variables-ml to _boxes-variables-yourThemeName. 

## Tests
You can run our tests in your browser:

1. Run the local web server:

        $ npm start

2. Run sass and browser-sync watching tasks:

        $ grunt sync
        
With this command you'll be automatically creating the css files :)

2. Navigate `http://localhost:3040/test/:component`

**We are going to automate it! :)**


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

Copyright (c) 2014 [MercadoLibre](http://github.com/mercadolibre).

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

7. Run a local web server:

        $ npm start

    Navigate [http://localhost:3040](http://localhost:3040/) and [http://localhost:3040/mobile](http://localhost:3040/mobile).

8. Develop! :)

**NOTE**

Please read through our code style guides:
- [HTML](https://github.com/mercadolibre/html-style-guide)
- [CSS](https://github.com/mercadolibre/css-style-guide)
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

In the folder "src" are Sass files, from here you can may make changes that affect the UI project in a fast and organized way.

src/
|
|– mobile/ # Properties only for Mobile 
|   |
|   |– css/ # Components list
|       |– _autocomplete.scss  # Autocomplete rules
|       |– _base.scss          # Base rules
|       |– _boxes.scss         # Boxes rules
|       `– mobile-ml.scss      # Imports the components to show
|       ...                    # Etc…
|   
|– shared/ # Properties shared in Mobile and UI
|   |
|   |– css/ # Components list
|       |– _autocomplete.scss  # Autocomplete rules
|       |– _base.scss          # Base rules
|       |– _boxes.scsss        # Boxes rules
|       ...                    # Etc…
|		|
|		`- common/ # Common shared skin and structure variables
|    		`– _variables-ml.scss  # Common shared skin and structure variables for ML
|
`– ui/ # Properties only for Desktop Bowsers
    |
    `– css/ # Components list
        |– _autocomplete.scss  # Autocomplete rules
        |– _badges.scss        # Badges rules
        |– _base.scss          # Base rules
        |– ui-ml.scss          # Imports the components to show
        ...                    # Etc…


### Css folder (inside mobile, shared or ui)

This folder have a list of each individual components, within each are the unique properties.

Note - mobile-ml.scss and ui-ml.scss these files are used to choose which components we have available at the final css. You can also edit the file and choose wich components you want to render.

### Common folder

Inside this folder (src/shared/css/common) you will find the sass file that is shared between Mobile and UI. From here you can change the main variables in Moblie and UI interface.

### Components estructure

Example:
			_autocomplete.scss
			autocomplete/
				`– _autocomplete-variables-ml.scss  # Extra custom properties

In the example, the first Sass (_autocomplete.scss) invokes the Sass file in a folder (_autocomplete-variables-ml.scss ) and includes the extra custom propieties on the component.

## Tests
You can run our tests in your browser:

1. Run the local web server:

        $ npm start

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

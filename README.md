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

6. Run a local web server:

        $ npm start

    Navigate [http://localhost:3040](http://localhost:3040/) and [http://localhost:3040/mobile](http://localhost:3040/mobile).

7. Develop! :)

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

```
src/
|
|– mobile/ # Properties only for Mobile 
|   |
|   |– css/ # Components list
|   |   |– _autocomplete.scss  # Autocomplete rules
|   |   |– _base.scss          # Base rules
|   |   |– _boxes.scsss        # Boxes rules
|   |   |– _mobile.scsss       # Imports the components to show
|   |   ...                    # Etc…
|   |
|   |- flavors/ 
|   |   |– _variables-ml.scss  # Custom colors for a components
|   |   `– _variables-mp.scss  # Custom colors for a components
|   |
|   `- structure/ 
|       |– _variables-ml.scss  # Custom fonts sizes, margin, etc for a components
|       `– _variables-mp.scss  # Custom fonts sizes, margin, etc for a components
|   
|– shared/ # Properties shared in Mobile and UI
|   |
|   |– css/ # Components list
|   |   |– _autocomplete.scss  # Autocomplete rules
|   |   |– _base.scss          # Base rules
|   |   |– _boxes.scsss        # Boxes rules
|   |   ...                    # Etc…
|   |
|   |- flavors/ 
|   |   |– _variables-ml.scss  # Custom colors for a components
|   |   `– _variables-mp.scss  # Custom colors for a components
|   |
|   `- structure/ 
|       |– _variables-ml.scss  # Custom fonts sizes, margin, etc for a components
|       `– _variables-mp.scss  # Custom fonts sizes, margin, etc for a components
|
`– ui/ # Properties only for Desktop Bowsers
    |
    |– css/ # Components list
    |   |– _autocomplete.scss  # Autocomplete rules
    |   |– _badges.scss        # Badges rules
    |   |– _base.scsss         # Base rules
    |   |– _ui.scsss           # Imports the components to shows
    |   ...                    # Etc…
    |
    |- flavors/ 
    |   |– _variables-ml.scss  # Custom colors for a components
    |   `– _variables-mp.scss  # Custom colors for a components
    |
    `- structure/ 
        |– _variables-ml.scss  # Custom fonts sizes, margin, etc for a components
        `– _variables-mp.scss  # Custom fonts sizes, margin, etc for a components
```

### Css folder (inside mobile, shared or ui)

In this folder is a list of each of the individual components within each are the unique properties.

Note - _mobile.scsss and _ui.scsss these files are used to choose which components we have available at the final css.

### Favors folder

In this folder are the themes that will impact colors punctually in the container scope (mobile, shared or ui). This folder is where you create a new theme in reference to the above.

### Estructure folder

In this folder are the themes that will impact font sizes, margins, padding and other that impacted on the container scope (mobile, shared or ui). This folder is where you create a new theme in reference to the above.

## Tests

You can run our tests in your browser:

1. Run the local web server:

        $ npm start

2. Navigate `http://localhost:3040/test/:component`

**We are going to automate it! :)**

## Theme setup
1. Install sass:

        $ sudo gem install sass

2. Watch sass to alert for changes and compile:

        $ sass --watch .

3. At the folder tree, go to `src/ui/css/chico.scss`

4. Change Flavor and Structure variables. 

-ml : MercadoLibre
-mp : MercadoPago

5. Save the file (sass will compile the new css created).

6. Overwrite the css from `src/ui/css/chico.css` to `vendor/chico.css`

7. Refresh the url

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

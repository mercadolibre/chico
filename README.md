# Chico UI  ![Get things done, quickly.](http://isitmaintained.com/badge/resolution/mercadolibre/chico.svg "Get things done, quickly.")

Chico UI is a free and open source collection of easy-to-use UI components for
designers and developers.

> Get things done, quickly.

## Development setup

1. Install [Git](http://git-scm.com/) and [NodeJS](http://nodejs.org/).
2. Open your terminal and clone `mercadolibre/chico` by running:

    ```sh
    $ git clone git@github.com:mercadolibre/chico.git
    ```

3. Now go to the project's folder:

    ```sh
    $ cd chico
    ```

4. Install its dependencies:

    ```sh
    $ npm install
    ```

5. Install `grunt-cli`:

    ```sh
    $ npm install grunt-cli -g
    ```

6. Run a local web server:

    ```sh
    $ npm start
    ```

    Navigate [http://localhost:3040](http://localhost:3040/) and
    [http://localhost:3040/mobile](http://localhost:3040/mobile).

7. Develop! :)

**NOTE**

Please read through our code style guides:
- [HTML](https://github.com/mercadolibre/html-style-guide)
- [CSS](https://github.com/mercadolibre/css-style-guide)
- [JavaScript](https://github.com/mercadolibre/javascript-style-guide)

## API Doc

You can read our [API Doc](http://chico.mercadolibre.com/).

The API doc may also be run locally by running:

```sh
$ grunt doc -env=ui
$ grunt doc -env=mobile
```

Navigate `./doc` directory and enjoy!

## Tests

You can run our tests in your browser:

1. Run the local web server:

    ```sh
    $ npm start
    ```

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

Copyright (c) 2015 [MercadoLibre](http://github.com/mercadolibre).

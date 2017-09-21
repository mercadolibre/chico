# Chico UI

[![npm](https://img.shields.io/npm/v/chico.svg)](https://www.npmjs.com/package/chico)
[![Known vulnerabilities](https://snyk.io/test/github/mercadolibre/chico/badge.svg)](https://snyk.io/test/github/mercadolibre/chico)

> A collection of easy-to-use UI components.

## Installation

Install it using npm:

```sh
$ npm install chico
```

*For a specific version, please check the
[releases](https://github.com/mercadolibre/chico/releases) section.*

## Development

*Make sure to have [Git](http://git-scm.com/) and
[Node](http://nodejs.org/) installed.*

1. Fork the repo and create a new branch —or just create a new branch if you
    have permissions.

2. Once you have your local copy, install its dependencies:

    ```sh
    $ npm install
    ```

3. Install [Gulp](https://gulpjs.com/):

    ```sh
    $ npm install gulp -g
    ```

4. Install [Browsersync](https://www.browsersync.io/):

    ```sh
    $ npm install browser-sync -g
    ```

5. Run the `dev` task

    ```sh
    $ gulp dev
    ```

    *This will open the "ui" version at
    [http://localhost:3040](http://localhost:3040/) in your default browser.
    The "mobile" version is at
    [http://localhost:3040/mobile](http://localhost:3040/mobile).*

6. Make all necessary changes, and when all is ready, open a PR.

### Code style and formatting

Make sure your code is complying with the following documents:

- [CSS](https://github.com/mercadolibre/css-style-guide)
- [JavaScript](https://github.com/mercadolibre/javascript-style-guide)

## Tests

Run all tests using:

```sh
$ npm test
```

This will run all tests in the terminal using PhantomJS.

Since tests are executed using the Karma test runner, so feel free to run
them in another browser. For example, If you want to use Google Chrome run:

```sh
./node_modules/.bin/karma start --browsers Chrome
```

## Documentation and live demos

For more information, documentation, or to see live demos, check our
[official website](http://chico.mercadolibre.com/).

## Special thanks

- Guille Paz ([@pazguille](https://twitter.com/pazguille)).
- Her Mammana ([@hmammana](https://twitter.com/hmammana)).
- Lean Linares ([@lean8086](https://twitter.com/lean8086)).
- Natan Santolo ([@natos](https://twitter.com/natos)). *Creator and former
    leader, now traveling around the world, drinking beer and looking for
    the secret of eternal life.*
- Nati Devalle ([@taly](https://twitter.com/taly)). *Because we love her.
    She is awesome!*
- Oleh Burkhay ([@atmaworks](https://twitter.com/atmaworks)).

## License

© 2012-2017 Mercado Libre. Licensed under the [MIT license](LICENSE.txt).

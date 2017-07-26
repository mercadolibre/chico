# Site

## Usage

### Installation

- Install Jekyll and its dependencies:

    ```sh
    gem install jekyll --version 2.5.3
    gem install jekyll-assets --version 1.0.0
    ```

- Install Bower and Grunt:

    ```sh
    npm install --global bower
    npm install --global grunt@0.4.5
    ```

- Install dependencies:

    ```sh
    npm install
    bower install
    ```

### Development

- Run locally:

    ```sh
    grunt dev
    ```

### API documentation

In `bower.json` file on the `chico` dependency, indicate the version for which
you want to generate the documentation.

- Install it using Bower:

    ```sh
    bower install
    ```

- Run locally:

    ```sh
    grunt apidoc
    ```

### Deploy

To publish your changes to http://chico.mercadolibre.com run:

    ```sh
    grunt deploy
    ```

Joiner - Chico UI
=================

Rock solid
----------
This robust application lets you programming into the separated files of Chico, providing a real-time compilation of all files into one, for testing and development usage.

Using
-----
To see it in action, run the Joiner through NodeJS and use it through port 3000 on browser or any tag like "link", "script", "img", etc.

### Executing the application

	$ cd chico/libs/joiner && node app.js

### Accessing

All JavaScript files in development mode (uncompressed):

	http://localhost:3000/js

All JavaScript files in production mode (minified):

	http://localhost:3000/js/min

All stylesheet files in development mode (uncompressed):

	http://localhost:3000/css

All stylesheet files in production mode (minified):

	http://localhost:3000/css/min

And you can get the assets too (images, sprites, etc.):

	http://localhost:3000/assets/xxxxx.*

Example
-------
Open index.html (located on root of Chico UI repository folder) in any browser,  after run application with NodeJS.
Check the URLs that the file is using: it's executing this Joiner.

Configuration
-------------
There is a configuration file on JSON format. It's on /libs folder and lets you change the templates used to generate the joined files, administrate the order of files to be joined, and specify default packages.

License
-------
http://chico-ui.com.ar/license
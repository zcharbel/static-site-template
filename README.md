# static-site-template

This is a Static Development Framework to allow you to develop your site using global elements, using PHP, but deploy your website with HTML.

Please follow the steps below to get set up and running.

### How do I get set up? ###

- Ensure that you have grunt, sass, node.js and php-cgi installed on your machine. If you do not, please follow the instructions contained within the links below:
    - Grunt - https://gruntjs.com/installing-grunt
    - SASS - http://sass-lang.com/install
    - Node.js - https://nodejs.org/en/download/
    - php-cgi - https://www.npmjs.com/package/grunt-php2html#installing-php-cgi

- Run "npm install" within terminal. This will install all packages associated with this build contained within the "package.json" file. More information on NPM can be found here https://docs.npmjs.com/getting-started/what-is-npm.

- Associated grunt tasks within this build:

"grunt" - This runs the 'grunt serve' task below.

"grunt dev" - This launches a local server that has browserSync attached to negate having to refresh your browser. 'Watch' task is also launched to compile SASS as you edit.

"grunt build" - This is for debugging your output HTML, CSS and JS when in development. Once run all files will be within the 'production' folder.

"grunt release" - This will take your PHP and output your code/files to the 'production' folder created within your root folder. While compressing your images and minifying your HTML, CSS and JS, to save file weight throughout.

### Comments for after set up.  ###

- If your site structure contains a folder heierarchy, you will need to update the "$ROOT" php varible on line 5 to ensure you're bringing in the correct files. See line 5 within both "index.php" and "folder/folder-test.php" for an example.

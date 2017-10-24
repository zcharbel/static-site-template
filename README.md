# static-site-template

This is a Static Development Framework that has been crafted by Whole Interactive. While development is be done using PHP to allow for making global elements simple, the output will be basic HTML. This framework uses SASS and boostrap.

Please follow the steps below to get set up and running.

### How do I get set up? ###

- Ensure that you have grunt, sass and node.js installed on your machine. If you do not, please follow the instructions contained within the links below:
- Grunt - https://gruntjs.com/installing-grunt
- SASS - http://sass-lang.com/install
- Node.js - https://nodejs.org/en/download/

- php-cgi is also required for this project. If you do not have this installed, php2html will not work if you do not have this installed (https://www.npmjs.com/package/grunt-php2html#installing-php-cgi).

- Run "npm install" within terminal. This will install all packages associated with this build contained within the "package.json" file. More information on NPM can be found here https://docs.npmjs.com/getting-started/what-is-npm.

- Associated grunt commands within this build:

"grunt" - This builds your 'build' folder that you will use for developme and automatically runs the 'grunt watch' command to pick up any edits you make. This is also the command you will use to watch your files as you make edits, which will make your life so much easier.

"grunt dev" - This is very similar to grunt. The only difference here is it just builds the 'build' folder and stops there without starting the 'watch' command.

"grunt release" - This is for when you are done developing your site and ready to push live. This command is like "grunt dev", but it compress' your images and minifies your css and js to save you some file weight throughout. This makes your website render faster than it would using just "grunt dev."

### Comments for after set up.  ###

- If your site structure contains a folder heierarchy, you will need to update the "$ROOT" php varible on line 5 to ensure you're bringing in the correct files. See line 5 within both "index.php" and "folder/folder-test.php" for an example.

EXECUTING:
1. run the command: node server.js (or nodemon server.js)
2. open a browser and type localhost:3003/edit_flashcard.html

# Database Setup
To set up the database to be used in on a local machine for development we need to first created the database in MySQL and then populate the .env configuration file.
## Creating the MySQL Database
First install MySQL. See this link on how to install it depending on your [OS](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/).  Once MySQL is installed and setup do the following to create the database.

 1. Run `mysql -u root - p` and then enter the root users password
 2. Run CREATE DATABASE StudyHelper
 3. Hit Ctrl-D to exit the command line tool

After this the database should be created and ready to use.
## Creating and Populating the .env File
The .env file is where our configuration information is kept. This gets loaded into the process.env enviroment variable for node when the server starts up. Add the following entries to allow the mysql package to connect to the database you set up previously.

 - DB_HOST=localhost
 - DB_USER=root
 - DB_PASS=__root_password__
 - DB_NAME=StudyHelper

Replace the __root_password__ with the password for that MySQL user, in this case the password you entered when logging MySQL through the command line.

Once these items have been added the mysql node package should be able to connect to your local database.

## Troubleshooting Database Connection Errors

 1. __ER_NOT_SUPPORTED_AUTH_MODE:__ : If you're getting this error after following the steps above run the following commands to address this issue. 
	 1. Run the mysql command line tool again and login as root
	 2. Run this command `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '__password__'` Where __password\_\_ is the password you used for root.
	 3. Then run ``flush privileges;``

	More information regarding this error can be found [here](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/53382070).
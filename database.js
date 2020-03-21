/**
 * Database wrapper for the mysql connection object
 * To use this object you first must create the database in mysql.
 * To do this 
 *  1) Run mysql through command line with the follow command mysql -u root -p 
 *  2) Type in the password for the root user
 *  3) run CREATE DATABASE StudyHelper
 *  4) Exit mysql
 *  
 *  After creating the database create a .env file. This is where we'll store our database configuration information.
 *  In the .env file add the following:
 *     DB_HOST=localhost
 *     DB_USER=root
 *     DB_PASS=__root_password__
 *     DB_NAME=StudyHelper
 *  
 *  Replacing __root_password__ with the password for the root user or blank if mysql has been configured that way.
 *   
 *  After creating the database and the .env  mysql will be able to connect to the database and perform operations on it.
 *  For more information on the nodejs mysql package see here: https://www.npmjs.com/package/mysql#introduction
 */

 const mysql = require('mysql');

 module.exports = class Database {
    /**
     * 
     * @param {*} enviroment the current enviroment object containing the database connection info
     */
    constructor(enviroment) {
        var connectionObject = {
            user : enviroment.DB_USER,
            password : enviroment.DB_PASS,
            database : enviroment.DB_NAME,
            //this is only used for cleaning up the test database, so it's only needed when the enviroment.NODE_ENV === 'test'
            multipleStatements: enviroment.NODE_ENV === 'test'
        }
        if (enviroment.NODE_ENV === 'production') {
            connectionObject['socketPath'] = enviroment.DB_SOCKET_PATH;
        } else {
            connectionObject['host'] == enviroment.DB_HOST;
        }

        this.db = mysql.createConnection(connectionObject);
        this.db.connect((err) => {
            if (err) {
                console.log("Unable to initialize database connection! Aborting server start up with error: " + err.message);
                throw err;
            }

            console.log("Sucessfully connected to database.");
        });
    }
    
    initializeTablesIfNeeded() {
        const createUsersTableSQL = `create table IF NOT EXISTS user(
            email VARCHAR(20) NOT NULL,
            password VARCHAR(20) NOT NULL, 
            fname VARCHAR(20) NOT NULL,
            lname VARCHAR(20),
            PRIMARY KEY(email)
        );`
        this.db.query(createUsersTableSQL, (err) => {
            if (err) {
                console.log("Unable to initialize database tables! Aborting server start up with error: " + err.message);
                throw err;
            }
        });

        const createCoursesTableSQL = `CREATE TABLE IF NOT EXISTS Courses(
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            lastAccess DATETIME,
            midterm bit NOT NULL,
            final bit NOT NULL,
            userEmail VARCHAR(255),
            FOREIGN KEY (userEmail)
                REFERENCES user(email)
                ON DELETE CASCADE
        );`;
        this.db.query(createCoursesTableSQL, (err) => {
            if (err) {
                console.log("Unable to initialize database tables! Aborting server start up with error: " + err.message);
                throw err;
            }
        });

        const createChapterTableSQL = `CREATE TABLE IF NOT EXISTS Decks(
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            lastAccess DATETIME,
            lastStudy DATETIME,
            midterm bit NOT NULL,
            final bit NOT NULL,
            courseId INT NOT NULL,
            FOREIGN KEY (courseId)
                REFERENCES Courses(id)
                ON DELETE CASCADE
        );`;
        this.db.query(createChapterTableSQL, (err) => {
            if (err) {
                console.log("Unable to initialize database tables! Aborting server start up with error: " + err.message);
                throw err;
            }
        });

        const createCardTableSQL = `CREATE TABLE  IF NOT EXISTS Cards(
            id INT NOT NULL AUTO_INCREMENT,
            prompt VARCHAR(2000) NULL DEFAULT 'This card is blank',
            answer VARCHAR(2000) NULL DEFAULT 'This card is blank',
            nextStudyTime DATETIME,
            deckId INT NOT NULL,
            FOREIGN KEY (deckId)
                REFERENCES Decks(id),    
            PRIMARY KEY (id)
        );`;
 
        this.db.query(createCardTableSQL, (err) => {
            if (err) {
                console.log("Unable to initialize database tables! Aborting server start up with error: " + err.message);
                throw err;
            }
        });

    }

    /**
     * 
     * @param {string} sql sql query statement
     * @param {[]} values array of values for the query. The types in the array depend on the columns of the table.
     * @param {(error, results, fields)} resultsCallback callback to process the data or errors from the query. 
     * Can be of form (error) => {}, or (error, results, fields) => {}
     */
    runQuery(sql, values, resultsCallback) {
        this.db.query(sql, values, resultsCallback);
    }

    /**
     * Closes the database connection
     */
    close() {
        this.db.end((err) => {
            if (err) {
                console.error(err.message);
            }

            console.log("Closed connection to dev database")
        })
    }
 }
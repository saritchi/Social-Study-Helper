const database = require('../database/database')(process.env);

/**
 * User model that communicates with the database
 */
class User {
    constructor(email, password = '', fname = '', lname = '') {
        this.email = email;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
        this.isAuthenticated = false;
    }

    async exists() {
        const query = `Select * from user where email = ?`;
        const result = await database.runQuery(query, [this.email]);
        return result.length !== 0;
    }

    async create() {
        const query = 'INSERT INTO user SET ?';
        await database.runQuery(query, {email: this.email, password: this.password, fname: this.fname, lname: this.lname});
    }

    /**
     * Checks if the user exists, and then sets up  the class members with the correct information based on the if the user exists or not
     */
    async authenticate() {
        const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
        const results = await database.runQuery(query, [this.email, this.password]);
        
        this.password = '';
        if(results.length > 0){
            this.isAuthenticated = true;
            this.fname = results[0].fname;
            this.lname = results[0].lname;
        }
        else{
            this.isAuthenticated = false;
        }
        
    }

}

module.exports = User;
/**
 * Get a user associated with the given email
 * @param {*} email a user's email
 * @returns A User object
 */
module.exports.getUserFromEmail = async function getUserFromEmail(email) {
    const query = 'SELECT * FROM user WHERE email = ?';
    const results = await database.runQuery(query, email);
    const result = results[0];
    return new User(result.email, result.password, result.fname, result.lname);
}
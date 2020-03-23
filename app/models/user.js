const database = require('../database/database')(process.env);

class User {
    constructor(email, password, fname = '', lname = '') {
        this.email = email;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
        this.isAuthenticated = false;
    }

    async exists() {
        const query = `Select * from user where email = ?`;
        const result = await database.runQuery(query, [this.email]);
        if(result.length == 0){ 
            return false;
        }
        
        return true;
    }

    async register() {
        const query = 'INSERT INTO user SET ?';
        await database.runQuery(query, {email: this.email, password: this.password, fname: this.fname, lname: this.lname});
    }

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
module.exports.getUserFromEmail = async function getUserFromEmail(email) {
    const query = 'SELECT FROM user WHERE email = ?';
    const result = await database.runQuery(query, email);

    return new User(result.email, result.password, result.fname, result.lname);
}
const database = require('../database')(process.env);

module.exports = class User {
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
        if(result.length > 0){ 
            return false;
        }
        
        return true;
    }

    async register() {
        const query = 'INSERT INTO user SET ?';
        database.runQuery(query, [this.email, this.password, this.fname, this.lname]);
    }

    async authenticate() {
        const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
        const results = await database.runQuery(query, [this.email, this.password]);
        if(results.length > 0){
            this.isAuthenticated = true;
            this.password = '';
            this.fname = results[0].fname;
            this.lname = results[0].lname;
        }
        else{
            this.isAuthenticated = false;
        }
    }
}
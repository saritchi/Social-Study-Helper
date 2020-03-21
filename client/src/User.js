export default class User {
    constructor(email, password, fname, lname, isAuthenticated) {
        this.email = email;
        this.password = password;
        this.fname = fname;
        this.lname = lname;
        this.isAuthenticated = isAuthenticated;
    }

    copy(other) {
        this.email = other.email;
        this.password = other.password;
        this.fname = other.fname;
        this.lname = other.lname;
        this.isAuthenticated = other.isAuthenticated;

        return this;
    }
}
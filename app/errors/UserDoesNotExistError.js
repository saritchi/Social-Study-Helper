module.exports = class UserDoesNotExist extends Error {
    constructor(email, ...params) {
        super(...params)

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, UserDoesNotExist)
        }

        this.name = "UserDoesNotExist"
        this.email = email;
    }
}
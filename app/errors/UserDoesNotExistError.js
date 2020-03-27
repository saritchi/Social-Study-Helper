module.exports = class UserDoesNotExistError extends Error {
    constructor(email, ...params) {
        super(...params)

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, UserDoesNotExistError)
        }

        this.name = "UserDoesNotExistError"
        this.email = email;
    }
}
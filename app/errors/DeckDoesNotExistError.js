module.exports = class DeckDoesNotExistError extends Error {
    constructor(email, ...params) {
        super(...params)

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, DeckDoesNotExistError)
        }

        this.name = "DeckDoesNotExistError"
        this.email = email;
    }
}
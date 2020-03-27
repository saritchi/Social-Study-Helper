module.exports = class DeckDoesNotExistError extends Error {
    constructor(email, ...params) {
        super(...params)

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, DeckDoesNotExist)
        }

        this.name = "DeckDoesNotExist"
        this.email = email;
    }
}
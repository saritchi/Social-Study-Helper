require('dotenv').config();
const request = require('supertest');
const app = require('../app/app');
const Database = require('../app/database/database.js')
var  database = Database(process.env);;
var authAgent = request.agent(app);


beforeAll(async () => {
    await database.connect();
    database.initializeTablesIfNeeded();
});

describe('registration tests', () => {
    test('valid user should register', async () => {
        return request(app)
            .post("/api/register")
            .send({
                email: "test@test.com",
                password: "test",
                fname: "super",
                lname: "test",
            })
            .expect(200);
    })
    test('duplicate user should return conflict', async () => {
        return request(app)
            .post("/api/register")
            .send({
                email: "test@test.com",
                password: "test",
                fname: "super",
                lname: "test",
            })
            .expect(409);
    })
})

describe('auth tests', () => {
    test('valid user should authenticate', async () => {
        return authAgent
            .post("/api/auth")
            .send({
                email: "test@test.com",
                password: "test",
            })
            .expect(200)
            .expect({
                email: "test@test.com",
                fname: "super",
                lname: "test",
                isAuthenticated: true
            });
    })
    test('invalid user should not authenticate', async () => {
        return request(app)
            .post("/api/auth")
            .send({
                email: "test@test.com",
                password: "badpassword",
            })
            .expect({
                email: "test@test.com",
                fname: '',
                lname: '',
                isAuthenticated: false
            })
    })
})

describe('add course tests', () => {
    test('should be able to add course', async () => {
        return authAgent
            .post("/api/addCourse")
            .send({
                coursename: "test course",
                decks: [
                    'test deck 1',
                    'test deck 2'
                ],
                email: "test@test.com",
            })
            .expect(200)
    })
    test('should not be able to add course with empty name', async () => {
        return authAgent
            .post("/api/addCourse")
            .send({
                coursename: "",
                decks: [
                    'test deck 1',
                    'test deck 2'
                ],
                email: "test@test.com",
            })
            .expect(400);
    })
    test('should not be able to add course with any empty decks', async () => {
        return authAgent
            .post("/api/addCourse")
            .send({
                coursename: "test course",
                decks: [
                    'good deck',
                    '',
                    'good deck 2'
                ],
                email: "test@test.com",
            })
            .expect(400);
    })
    test('should not be able to  add course when not authenticated', async () => {
        return request(app)
            .post("/api/addCourse")
            .send({
                coursename: "test course",
                decks: [
                    'good deck',
                    '',
                    'good deck 2'
                ],
                email: "test@test.com",
            })
            .expect(401);
    })
})

describe('get courses tests', () => {
    test('should be able to get courses', async () => {
        return authAgent
            .get("/api/courses")
            .query({email: "test@test.com"})
            .expect(200)
            .expect({
                result: [
                    {
                        id: 1,
                        name: "test course",
                        lastAccess: null,
                        midterm: false,
                        final: false,
                        userEmail: "test@test.com"
                    }
                ]
            })
    })
    test('should not be able to get courses when not authenticated', async () => {
        return request(app)
            .get("/api/courses")
            .query({email: "test@test.com"})
            .expect(401);
    })
})

describe('get decks tests', () => {
    test('should be able to get decks', async () => {
        return authAgent
            .get("/api/decks")
            .query({id: 1})
            .expect(200)
            .expect({
                result: [
                    {
                        id: 1,
                        name: "test deck 1",
                        lastAccess: null,
                        lastStudy: null,
                        midterm: false,
                        final: false,
                        courseId: 1
                    },
                    {
                        id: 2,
                        name: "test deck 2",
                        lastAccess: null,
                        lastStudy: null,
                        midterm: false,
                        final: false,
                        courseId: 1
                    }
                ]
            })
    })
    test('should not be able to get decks when not authenticated', async () => {
        return request(app)
            .get("/api/decks")
            .query({id: 1})
            .expect(401);
    })
})


describe('add card tests', () => {
    test('should be able to add card', async () => {
        return authAgent
            .post("/api/addDeck")
            .query({id: '1'})
            .send({
                deckname: "test course",
                cards: [
                    {
                        prompt: 'Test Prompt',
                        answer: 'Test Answer'
                    }
                ]
            })
            .expect(200)
    })
    test('should not be able to add decks when not authenticated', async () => {
        return request(app)
            .post("/api/addDeck")
            .query({id: '1'})
            .send({
                deckname: "test course",
                cards: [
                    {
                        prompt: 'Test Prompt',
                        answer: 'Test Answer'
                    }
                ]
            })
            .expect(401);
    })
})

describe('view cards tests', () => {
    test('should be able to get cards', async () => {
        return authAgent
            .get("/api/viewCards")
            .query({id: '3'})
            .expect(200)
            .expect({
                result: [{
                    prompt: 'Test Prompt',
                    answer: 'Test Answer',
                    deckId: 3,
                    id: 1,
                    nextStudyTime: null,
                }]
            })
    })

    test('should not be able to view cards when not authenticated', async () => {
        return request(app)
            .get("/api/viewCards")
            .query({id: '3'})
            .expect(401);
    })
})

describe('share courses tests', () => {
    //create the second user.
    beforeAll(() => {
        return request(app)
        .post("/api/register")
        .send({
            email: "test2@test.com",
            password: "test2",
            fname: "super",
            lname: "test2",
        })
    })

    test('should be able to share course', async () => {
        return authAgent
            .post("/api/shareCourse")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test2@test.com'],
                id: 1
            })
            .expect(200)
            .expect({ result: 
                [{
                    toUser: 'test2@test.com',
                    fromUser: 'test@test.com',
                    courseId: 1,
                    id: 1
                }]
            })
    })

    test('should be able to get shared courses', async () => {
        return authAgent
            .get("/api/sharedCourses")
            .query({email: "test2@test.com"})
            .expect(200)
            .expect({result: [{
                id: 1,
                name: "test course",
                lastAccess: null,
                midterm: false,
                final: false,
                userEmail: "test@test.com"
            }]})
    })

    test('should not be able to share course when the toEmail does not exist', async () => {
        return authAgent
            .post("/api/shareCourse")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['notreal@noemail.com'],
                id: 1
            })
            .expect(404);
    })

    test('should not be able to share course with yourself', async () => {
        return authAgent
            .post("/api/shareCourse")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test@test.com'],
                id: 1
            })
            .expect(400);
    })

    test('should not be able to share course when not authenticated', async () => {
        return request(app)
            .post("/api/shareCourse")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test2@test.com'],
                id: 1
            })
            .expect(401);
    })

    test('should not be able to get shared courses when not authenticated', async () => {
        return request(app)
            .get("/api/sharedCourses")
            .query({email: "test2@test.com"})
            .expect(401);
    })
})

describe('share decks tests', () => {
    beforeAll(() => {
        return request(app)
        .post("/api/register")
        .send({
            email: "test3@test.com",
            password: "test3",
            fname: "super",
            lname: "test3",
        })
    })

    test('should be able to share deck', async () => {
        return authAgent
            .post("/api/shareDeck")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test3@test.com'],
                id: 1
            })
            .expect(200)
            .expect({ result: 
                [{

                    toUser: 'test3@test.com',
                    fromUser: 'test@test.com',
                    deckId: 1,
                    id: 1
                }]
            })
    })

    test('should be able to get shared courses', async () => {
        return authAgent
            .get("/api/sharedDecks")
            .query({email: "test3@test.com"})
            .expect(200)
            .expect({result: [{
                id: 1,
                name: "test deck 1",
                lastAccess: null,
                lastStudy: null,
                midterm: false,
                final: false,
                courseId: 1
            }]})
    })

    test('should not be able to share deck when the toEmail does not exist', async () => {
        return authAgent
            .post("/api/shareDeck")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['notreal@noemail.com'],
                id: 1
            })
            .expect(404);
    })

    test('should not be able to share deck with yourself', async () => {
        return authAgent
            .post("/api/shareDeck")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test@test.com'],
                id: 1
            })
            .expect(400);
    })

    test('should not be able to share course when not authenticated', async () => {
        return request(app)
            .post("/api/shareDeck")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test3@test.com'],
                id: 1
            })
            .expect(401);
    })

    test('should not be able to get shared courses when not authenticated', async () => {
        return request(app)
            .get("/api/sharedDecks")
            .query({email: "test3@test.com"})
            .expect(401);
    })
})

describe('logout tests', () => {
    test('should not be able to logout when not authenticated',() => {
        return request(app)
        .get("/api/logout")
        .expect(401)
    })
    test('should be able to logout', () => {
        return authAgent
            .get("/api/logout")
            .expect(200)
    })
    test('should not be able to access authentication content after logout', () => {
        return authAgent
        .get("/api/courses")
        .query({email: "test@test.com"})
        .expect(401);
    })
})

afterAll(async () => {
    return database.close();
});
  
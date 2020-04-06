require('dotenv').config();
const request = require('supertest');
const app = require('../app/app');
const Database = require('../app/database/database.js')
const TestDatabaseHelper = require('./helpers/testDatabaseManager');
var  database = Database(process.env);;
var authAgent = request.agent(app);


beforeAll(async () => {
    await database.connect();
    database.initializeTablesIfNeeded();

    //initialize test data
    await request(app)
        .post("/api/register")
        .send({
            email: "test@test.com",
            password: "test",
            fname: "super",
            lname: "test",
        })
        .expect(200);

    await authAgent
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
    
    //create a second user for sharing
    await request(app)
        .post("/api/register")
        .send({
            email: "test2@test.com",
            password: "test2",
            fname: "super",
            lname: "test2",
        })
    
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
});

describe('share courses tests', () => {
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
        return authAgent
            .post("/api/addCourse")
            .send({
                coursename: "test course 3",
                decks: ['test deck 3'],
                email: "test@test.com",
            })
            .expect(200)
    })

    test('should be able to share deck', async () => {
        return authAgent
            .post("/api/shareDeck")
            .send({
                fromEmail: 'test@test.com',
                toEmails: ['test2@test.com'],
                id: 3
            })
            .expect(200)
            .expect({ result: 
                [{

                    toUser: 'test2@test.com',
                    fromUser: 'test@test.com',
                    deckId: 3,
                    id: 3
                }]
            })
    })

    test('should be able to get shared decks', async () => {
        return authAgent
            .get("/api/sharedDecks")
            .query({email: "test2@test.com"})
            .expect(200)
            .expect({result: [
                {
                    name: "test deck 1",
                    midterm: false,
                    final: false,
                    courseId: 1,
                    id: 1,
                    lastAccess: null,
                    lastStudy: null,
                },
                {
                    name: "test deck 2",
                    midterm: false,
                    final: false,
                    courseId: 1,
                    id: 2,
                    lastAccess: null,
                    lastStudy: null,
                },
                {
                    name: "test deck 3",
                    midterm: false,
                    final: false,
                    courseId: 2,
                    id: 3,
                    lastAccess: null,
                    lastStudy: null,
                }
            ]})
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
                toEmails: ['test2@test.com'],
                id: 1
            })
            .expect(401);
    })

    test('should not be able to get shared courses when not authenticated', async () => {
        return request(app)
            .get("/api/sharedDecks")
            .query({email: "test2@test.com"})
            .expect(401);
    })
})

afterAll(async () => {
    try {
        await TestDatabaseHelper.reset(database);
    } finally {
        await database.close();
    }
});
  
require('dotenv').config();
const request = require('supertest');
const app = require('../app/app');
const Database = require('../app/database.js')
var database;



beforeAll(async () => {
    database = Database(process.env);
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
        return request(app)
            .post("/api/auth")
            .send({
                email: "test@test.com",
                password: "test",
            })
            .expect(200)
            .expect({
                email: "test@test.com",
                password: '',
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
                password: '',
                fname: '',
                lname: '',
                isAuthenticated: false
            })
    })
})

describe('add course tests', () => {
    test('should be able to add course', async () => {
        return request(app)
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
        return request(app)
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
            .expect(400);
    })
})

describe('get courses tests', () => {
    test('should be able to get courses', async () => {
        return request(app)
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
})

describe('get decks tests', () => {
    test('should be able to get decks', async () => {
        return request(app)
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
})


describe('add card tests', () => {
    test('should be able to add card', async () => {
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
            .expect(200)
    })
})

describe('view cards tests', () => {
    test('should be get cards', async () => {
        return request(app)
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
})

afterAll(() => {
    return database.close();
});
  
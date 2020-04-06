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


afterAll(async () => {
    try {
        await TestDatabaseHelper.reset(database);
    } finally {
        await database.close();
    }
});
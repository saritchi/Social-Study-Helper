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
    
    await authAgent
        .post("/api/addCourse")
        .send({
            coursename: "test course",
            decks: [],
            email: "test@test.com",
        })
        .expect(200)
    
    await authAgent
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
});

describe('view cards tests', () => {
    test('should be able to get cards', async () => {
        return authAgent
            .get("/api/viewCards")
            .query({id: '1'})
            .expect(200)
            .expect({
                result: [{
                    prompt: 'Test Prompt',
                    answer: 'Test Answer',
                    deckId: 1,
                    id: 1,
                    nextStudyTime: null,
                }]
            })
    })

    test('should not be able to view cards when not authenticated', async () => {
        return request(app)
            .get("/api/viewCards")
            .query({id: '1'})
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
  
  
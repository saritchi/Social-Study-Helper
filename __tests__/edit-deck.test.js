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
            decks: [
                'test deck 1',
                'test deck 2'
            ],
            email: "test@test.com",
        })
        .expect(200)

    await authAgent
        .post("/api/addDeck")
        .query({id: '1'})
        .send({
            deckname: "test deck 1",
            cards: [
                {
                    prompt: 'Test Prompt 1',
                    answer: 'Test Answer 1'
                }
            ]
        })
        .expect(200)
});

describe('edit deck tests', () => {

    test('should update cards with new data', async () => {
        return authAgent  
            .post("/api/editDeck")
            .query({id: '1'})
            .send({
                deckname: "Edited test course",
                cards: [
                    {
                        prompt: 'Edited Prompt',
                        answer: 'Edited Answer'
                    }
                ],
                deckId: 1,
                courseId: 1
            })
            .expect(200)
    })

    test('should not be able to edit decks when not authenticated', async () => {
        return request(app)
            .get("/api/editDeck")
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
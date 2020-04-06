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
});

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

afterAll(async () => {
    try {
        await TestDatabaseHelper.reset(database);
    } finally {
        await database.close();
    }
});
  
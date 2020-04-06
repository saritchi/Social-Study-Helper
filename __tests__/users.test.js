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
    try {
        await TestDatabaseHelper.reset(database);
    } finally {
        await database.close();
    }
});
  
const request = require('supertest');
const app = require('../app');

describe('authentication tests', () => {
    test('valid user authentication', async () => {
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
})
  
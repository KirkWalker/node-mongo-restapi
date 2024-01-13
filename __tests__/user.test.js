const request = require("supertest");
const app = require('../server.js');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

let server
let accessToken
let user = process.env.AUTH_USER
let pwd = process.env.AUTH_PW
let cookie

beforeAll(async () => {
    server = app.listen(PORT);
    await request(app)
    .post("/auth")
    .set("Content-Type", "application/json")
    .send({user, pwd})
    .expect(200)
    .then((res) => {
        //console.log("accessToken:",res.body.accessToken);
        cookie = res.headers['set-cookie']
        //console.log("cookie:",cookie)
        accessToken = res.body.accessToken
    });
})


describe("user route test", () => {

    test ("Get all users - Should respond with 200 status code", async () => {
        await request(app)
            .get("/users")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    })

});

describe("Register user functions", () => {
    test ("Register new user bad request - should respond with 400 status code", async () => {
        await request(app)
            .post("/register")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({})
            .expect(400); 
    })

    test ("Register new user duplicate user - should respond with 409 status code", async () => {
        await request(app)
            .post("/register")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"user":"kirk","pwd":"madeuppw"})
            .expect(409); 
    })

    //we will skip the register user until a delete user endpoint is created.

});

describe("Clean up functions", () => {

    test ("Logout with a cookie - should respond with 204 status code", async () => {
        await request(app)
            .get("/logout")
            .set("Content-Type", "application/json")
            .send()
            .set('Cookie',cookie)
            .expect(204); 
    })

})

afterAll((done)=>{
    mongoose.connection.close();
    done();
    server.close()
});

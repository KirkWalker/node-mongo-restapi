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
})


describe("Login user functions", () => {
    

    test ("Bad pw - Should respond with 401 status code", async () => {
        await request(app)
            .post("/auth")
            .set("Content-Type", "application/json")
            .send({user: 'kirk', pwd: 'wrong'})
            .expect(401);
    })
    test ("Empty request - Should respond with 400 status code", async () => {
        await request(app)
            .post("/auth")
            .set("Content-Type", "application/json")
            .send({})
            .expect(400);
    })
    test ("Not a user - should respond with 401 status code", async () => {
        await request(app)
            .post("/auth")
            .set("Content-Type", "application/json")
            .send({user: 'frank', pwd: 'wrong'})
            .expect(401); 
    })
    test ("Good pw and user - Should respond with 200 status code", async () => {
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
});

describe("Token handling functions", () => {

    test ("Refresh no token - should respond with 401 status code", async () => {
        await request(app)
            .get("/refresh")
            .set("Content-Type", "application/json")
            .send()
            .expect(401); 
    })

    test ("Refresh with cookie - should respond with 200 status code", async () => {
        await request(app)
            .get("/refresh")
            .set("Content-Type", "application/json")
            .send()
            .set('Cookie',cookie)
            .expect(200); 
    })
});

describe("Logout user functions", () => {
    test ("Logout - should respond with 204 status code", async () => {
        await request(app)
            .get("/logout")
            .set("Content-Type", "application/json")
            .send()
            .set('Cookie',{})
            .expect(204); 
    })

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

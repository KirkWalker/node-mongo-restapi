const request = require("supertest");
const app = require('../server.js');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

let server
let accessToken
let user = process.env.AUTH_USER
let pwd = process.env.AUTH_PW
let userid

beforeAll(async () => {
    server = app.listen(PORT);
    await request(app)
    .post("/auth")
    .set("Content-Type", "application/json")
    .send({user, pwd})
    .expect(200)
    .then((res) => {
        //console.log("res",res.body.accessToken);
        accessToken = res.body.accessToken
    });
})

describe("Get employees route test", () => {

    test ("Get all employees - Should respond with 200 status code", async () => {
        await request(app)
            .get("/employees")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    })

    test ("Get single employee - Should respond with 200 status code", async () => {
        await request(app)
            .get("/employees/65a0ccdddefc572274749e33")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    })

    test ("Get single employee, not found - Should respond with 204 status code", async () => {
        await request(app)
            .get("/employees/65a0ccdddefc572274749e32")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204);
    })
});

describe("Adding employees functions", () => {

    test ("Create employee request, no data - Should respond with 400 status code", async () => {
        await request(app)
            .post("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({})
            .expect(400);
    })

    test ("Create employee request - Should respond with 201 status code", async () => {
        await request(app)
            .post("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"firstname":"john","lastname":"doe"})
            .expect(201)
            .then((res) => {
                //console.log("res",res.body);
                if (res?.body?._id){
                    userid=res.body._id
                    //console.log("userid",userid);
                }
            });
    })
});

describe("Updating functions", () => {
    test ("Successfull update employee request - Should respond with 400 status code", async () => {
        await request(app)
            .put("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({id:'65a0ccdddefc572274749e33',lastname:'jesttesting'})
            .expect(200);
    })

    test ("Invalid update employee request, id missing - Should respond with 400 status code", async () => {
        await request(app)
            .put("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({id:'',lastname:'jesttesting'})
            .expect(400);
    })

    test ("Invalid update employee request, bad id - Should respond with 400 status code", async () => {
        await request(app)
            .put("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({id:'65a0ccdddefc572274749e334',lastname:'jesttesting'})
            .expect(400);
    })

    test ("Invalid update employee request, employee not found - Should respond with 204 status code", async () => {
        await request(app)
            .put("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({id:'65a0ccdddefc572274749e32',lastname:'jesttesting'})
            .expect(204);
    })
});

describe("Delete employee functions", () => {
    test ("Delete employee request - Should respond with 200 status code", async () => {
        await request(app)
            .delete("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"id":userid})
            .expect(200)
            .then((res) => {
                //console.log("res",res.body);
            });
    })

    test ("Delete employee request with bad id- Should respond with 204 status code", async () => {
        await request(app)
            .delete("/employees/")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"id":'65a2fd9dce8a9bab6418bc71'})
            .expect(204)
            .then((res) => {
                //console.log("res",res.body);
            });
    })
});

describe("Extra employee functions", () => {
    test ("Bad Path - Should respond with 404 status code", async () => {
        await request(app)
            .get("/badpath")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
    })
})

afterAll((done)=>{
    mongoose.connection.close();
    done();
    server.close()
});

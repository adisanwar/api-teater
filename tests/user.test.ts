import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { UserTest } from "./user-test";
describe('POST /api/users', () =>{

    // afterEach ( async () => {
    //     await UserTest.delete();
    // })
    it(`should reject register new user if request is invalid`, async () =>  {
        const response = await supertest(web).post("/api/users").send({
            username : "",
            password : "",
            name     : ""

        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined;
        
    });

    it(`should register new user`, async () =>  {
        const response = await supertest(web).post("/api/users").send({
            username : "Adi",
            password : "Rahasia",
            name     : "Adi Saepul"

        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("Adi");
        expect(response.body.data.name).toBe("Adi Saepul");
        
    });
})
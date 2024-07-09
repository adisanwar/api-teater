import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {ContactTest} from "./test-util";
import bcrypt from "bcrypt";

describe('POST /api/contacts', () => { 
    beforeEach(async () => {
        await ContactTest.create()
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
    });

    it('should create new contact', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name : "adi",
                last_name: "saepul",
                email: "adi@example.com",
                phone: "0899999",
                ofcNo: "2378623",
                nationalId: 2378452283,

            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("adi");
        expect(response.body.data.last_name).toBe("saepul");
        expect(response.body.data.email).toBe("adi@example.com");
        expect(response.body.data.phone).toBe("0899999");
    });

    it('should reject create new contact if data is invalid', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name : "",
                last_name: "",
                email: "",
                phone: "",
                ofcNo: "",
                nationalid: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.data.id).toBeDefined();
    });

}
)
import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { TheaterTest, UserTest } from "./test-util"

describe(`POST /api/theater/`, () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
    })
    afterEach(async () => {
        await TheaterTest.deleteAll();
        await UserTest.delete();
    })

    it(`should be able to create theater`, async () => {
        const response = await supertest(web)
        .post(`/api/theater/`)
        .set("X-API-TOKEN", "test")
        .send({
            name: "Test",
            location: "Test",
            capacity: "250 Orang"

        })
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("Test")
        expect(response.body.data.location).toBe("Test")
        expect(response.body.data.capacity).toBe("250 Orang")
})

describe('GET /api/theater/current', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.get();
    });

    afterEach(async () => {
        await TheaterTest.deleteAll();
        await UserTest.delete();
    });

    it('should be able to get theater', async () => {
        const response = await supertest(web)
            .get("/api/theater/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("Test");
        expect(response.body.data.location).toBe("Test");
        expect(response.body.data.capacity).toBe("250 Orang");
    });

    // it('should reject get user if token is invalid', async () => {
    //     const response = await supertest(web)
    //         .get("/api/users/current")
    //         .set("X-API-TOKEN", "salah");

    //     logger.debug(response.body);
    //     expect(response.status).toBe(401);
    //     expect(response.body.errors).toBeDefined();
    // });
});
})
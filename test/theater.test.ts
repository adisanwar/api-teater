import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { ContactTest, ShowTest, TheaterTest, UserTest } from "./test-util"

describe(`POST /api/theaters/`, () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    })
    afterEach(async () => {
        await TheaterTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    })

    it(`should be able to create theaters`, async () => {
        const response = await supertest(web)
            .post(`/api/theaters/`)
            .set("X-API-TOKEN", "test")
            .send({
                name: "test",
                location: "test",
                capacity: "test"

            })
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.location).toBe("test");
        expect(response.body.data.capacity).toBe("test");


    });

    it('should reject create new theater if data is invalid', async () => {
        const response = await supertest(web)
            .post("/api/theaters")
            .set("X-API-TOKEN", "test")
            .send({
                name: "",
                location: "",
                capacity: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


})

describe('GET /api/theaters/current', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
    })
    afterEach(async () => {
        await TheaterTest.deleteAll();
        await UserTest.delete();
    })

    it('should be able to get theaters', async () => {
        const response = await supertest(web)
            .get("/api/theaters/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });


});

describe('GET /api/theaters/:theaterId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
    })
    afterEach(async () => {
        await TheaterTest.deleteAll();
        await UserTest.delete();
    })

    it('should be able to get theaters by id', async () => {
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .get(`/api/theaters/${theater.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });


});

describe('PATCH /api/theaters/:theaterId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
    })
    afterEach(async () => {
        await TheaterTest.deleteAll();
        await UserTest.delete();
    })

    it('should be able to update theater', async () => {
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .patch(`/api/theaters/${theater.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                name: "FX Sudirman",
                location: "Sudirman",
                capacity: "250",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(theater.id);
        expect(response.body.data.name).toBe("FX Sudirman");
        expect(response.body.data.location).toBe("Sudirman");
        expect(response.body.data.capacity).toBe("250");
    });

    it('should reject update theater if request is invalid', async () => {
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .patch(`/api/theaters/${theater.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                name: "",
                location: "",
                capacity: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/theaters/:theaterId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
    })
    afterEach(async () => {
        await TheaterTest.deleteAll();
        await UserTest.delete();
    })

    it('should be able to remove theater', async () => {
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .delete(`/api/theaters/${theater.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    // it('should reject remove theater if theater is not found', async () => {
    //     const theater = await TheaterTest.getById();
    //     const response = await supertest(web)
    //         .delete(`/api/theaters/${theater.id + 1}`)
    //         .set("X-API-TOKEN", "test");

    //     logger.debug(response.body);
    //     expect(response.status).toBe(404);
    //     expect(response.body.errors).toBeDefined();
    // });
});

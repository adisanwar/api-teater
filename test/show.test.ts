import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { ShowTest, TheaterTest, UserTest } from "./test-util"

describe(`POST /api/shows/`, () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
    })

    afterEach(async () => {
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it(`should be able to create shows`, async () => {
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .post(`/api/shows/${theater.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                title: "test",
                description: "test",
                duration: "test",
                rating:"test",
                theaterId: theater.id
            })
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe("test");
        expect(response.body.data.description).toBe("test");
        expect(response.body.data.duration).toBe("test");
        expect(response.body.data.rating).toBe("test");


    });

    it('should reject create new theater if data is invalid', async () => {
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .post(`/api/shows/${theater.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                title: "",
                description: "",
                duration: "",
                rating:"",
                theaterId : ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


})

describe('GET /api/shows/current', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
    })
    afterEach(async () => {
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to get shows', async () => {
        const response = await supertest(web)
            .get("/api/shows/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });

});

describe('GET /api/shows/:showId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
    })
    afterEach(async () => {
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to get shows by id', async () => {
        const show = await ShowTest.getById();
        // const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .get(`/api/shows/${show.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });


});

describe('PATCH /api/shows/:showId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
    })
    afterEach(async () => {
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to update show', async () => {
        const show = await ShowTest.getById();
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .patch(`/api/shows/${show.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                title: "Seifuku No Me",
                description: "Setlist Tunas Dibalik Seragam",
                duration: "3 Jam",
                rating:"5/5",
                theaterId: theater.id
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(show.id);
        expect(response.body.data.title).toBe("Seifuku No Me");
        expect(response.body.data.description).toBe("Setlist Tunas Dibalik Seragam");
        expect(response.body.data.duration).toBe("3 Jam");
        expect(response.body.data.rating).toBe("5/5");
    });

    it('should reject update show if request is invalid', async () => {
        const show = await ShowTest.getById();
        const theater = await TheaterTest.getById();
        const response = await supertest(web)
            .patch(`/api/shows/${show.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                title: "",
                description: "",
                duration: "",
                rating:"",
                theaterId: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/shows/:showId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
    })
    afterEach(async () => {
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to remove show', async () => {
        const show = await ShowTest.getById();
        const response = await supertest(web)
            .delete(`/api/shows/${show.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    // it('should reject remove show if theater is not found', async () => {
    //     const theater = await TheaterTest.getById();
    //     const response = await supertest(web)
    //         .delete(`/api/shows/${theater.id + 1000}`)
    //         .set("X-API-TOKEN", "test");

    //     logger.debug(response.body);
    //     expect(response.status).toBe(404);
    //     expect(response.body.errors).toBeDefined();
    // });
});

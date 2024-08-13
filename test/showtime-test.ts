import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import {ShowtimeTest, ShowTest, UserTest, TheaterTest} from "./test-util"

describe(`POST /api/showtimes/`, () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
    })

    afterEach(async () => {
        await ShowtimeTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to create showtimes', async () => {
        const show = await ShowTest.getById();
      
        // Generate a valid datetime string in MySQL format (YYYY-MM-DD)
        const validDatetime = new Date().toISOString().slice(0, 10); // Slicing to get only the date part
      
        const response = await supertest(web)
          .post(`/api/showtimes/${show.id}`)
          .set("X-API-TOKEN", "test")
          .send({
            showDate: validDatetime,  // Send date in MySQL format
            showTime: "18:00:00" // Use a valid time format
          });
      
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.showTime).toBe("18:00:00");
      
        // Consider adding error handling checks here
        if (response.status !== 200) {
          console.error(`Error: ${response.body.message}`);
        }
      });
      

    

    it('should reject create new showtime if data is invalid', async () => {
        const show = await ShowTest.getById();
        const response = await supertest(web)
            .post(`/api/shows/${show.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                showDate : "",
                showTime: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


})

describe('GET /api/showtimes/current', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await ShowtimeTest.create();
    })

    afterEach(async () => {
        await ShowtimeTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to get showtimes', async () => {
        const response = await supertest(web)
            .get("/api/showtimes/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });

});

describe('GET /api/showtimes/:showtimeId/shows/:showId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await ShowtimeTest.create();
    })

    afterEach(async () => {
        await ShowtimeTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to get showtimes by id', async () => {
        const showtime = await ShowtimeTest.getById();
        const show = await ShowTest.getById();
        const response = await supertest(web)
            .get(`/api/showtimes/${showtime.id}/shows/${show.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });


});

describe('PATCH /api/showtimes/:showtimeId/shows/:showId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await ShowtimeTest.create();
    })

    afterEach(async () => {
        await ShowtimeTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to update show', async () => {
        const showtime = await ShowtimeTest.getById();
        const show = await ShowTest.getById();
        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const response = await supertest(web)
            .patch(`/api/showtimes/${showtime.id}/shows/${show.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                showDate: yesterday.toISOString(), // Ensure date is in a valid format
                showTime: "test"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(new Date(response.body.data.showDate).toISOString()).toBe(yesterday.toISOString()); // Validate date
        expect(response.body.data.showTime).toBe("test");
    });

    it('should reject update show if request is invalid', async () => {
        const showtime = await ShowtimeTest.getById();
        const show = await ShowTest.getById();
        const response = await supertest(web)
            .patch(`/api/showtimes/${showtime.id}/shows/${show.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                showDate : "",
                showTime : ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/showtimes/:showtimeId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await ShowtimeTest.create();
    })

    afterEach(async () => {
        await ShowtimeTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to remove showtime', async () => {
        const showtime = await ShowtimeTest.getById();
        const response = await supertest(web)
            .delete(`/api/showtimes/${showtime.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it('should reject remove show if theater is not found', async () => {
        const theater = await ShowTest.getById();
        const response = await supertest(web)
            .delete(`/api/shows/${theater.id + 1000}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

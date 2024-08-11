import supertest from "supertest"
import { web } from "../src/application/web"
import { logger } from "../src/application/logging"
import { ContactTest, ShowTest, TheaterTest, TicketTest, UserTest } from "./test-util"

describe(`POST /api/tickets/`, () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await TheaterTest.create();
        await ShowTest.create();
    })

    afterEach(async () => {
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();

    })

    it(`should be able to create tickets`, async () => {
        const show = await ShowTest.getById();
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/tickets/${show.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                seatNumber: "test",
                price: "10000",
                photo: "test",
                showId: show.id,
                contactId: contact.id
            });
    
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.seatNumber).toBe("test");
        expect(response.body.data.price).toBe("10000");
        expect(response.body.data.photo).toBe("test");
        expect(response.body.data.contactId).toBe(contact.id); // Fix this line
        expect(response.body.data.showId).toBe(show.id); // Add this line for showId
    });
    

    it('should reject create new ticket if data is invalid', async () => {
        const show = await ShowTest.getById();
        const response = await supertest(web)
            .post(`/api/tickets/${show.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                seatNumber: "",
                price: "",
                photo: "",
                showId: "",
                contactId: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });


})

describe('GET /api/tickets/current', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await TicketTest.create();
    })

    afterEach(async () => {
        await TicketTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to get tickets', async () => {
        const response = await supertest(web)
            .get("/api/tickets/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });

});

describe('GET /api/tickets/:ticketId/shows/:shwoId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await TicketTest.create();
    })

    afterEach(async () => {
        await TicketTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to get tickets by id', async () => {
        const show = await ShowTest.getById();
        const ticket = await TicketTest.getById();
        const response = await supertest(web)
            .get(`/api/tickets/${ticket.id}/show/${show.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });


});

describe('PATCH /api/tickets/:showId/shows/:shwoId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await TicketTest.create();
    })

    afterEach(async () => {
        await TicketTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to update show', async () => {
        const show = await ShowTest.getById();
        const ticket = await TicketTest.getById();
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .patch(`/api/tickets/${ticket.id}/shows/${show.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                seatNumber: "update 1",
                price: "11111",
                photo: "update 1",
                showId: show.id,
                contactId: contact.id
            });
    
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(ticket.id); // Fix this line
        expect(response.body.data.seatNumber).toBe("update 1"); // Fix this line
        expect(response.body.data.price).toBe("11111"); // Fix this line
        expect(response.body.data.photo).toBe("update 1"); // Fix this line
        expect(response.body.data.showId).toBe(show.id); // Add this line
        expect(response.body.data.contactId).toBe(contact.id); // Add this line
    });
    

    it('should reject update show if request is invalid', async () => {
        const show = await ShowTest.getById();
        const ticket = await TicketTest.getById();
        const response = await supertest(web)
            .patch(`/api/tickets/${ticket.id}/theaters/${show.id}`)
            .set("X-API-TOKEN", 'test')
            .send({
                seatNumber: "",
                price: "",
                photo: "",
                showId: "",
                contactId: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/tickets/:ticketId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await TheaterTest.create();
        await ShowTest.create();
        await TicketTest.create();
    })

    afterEach(async () => {
        await TicketTest.deleteAll();
        await ShowTest.deleteAll();
        await TheaterTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();

    })

    it('should be able to remove ticket', async () => {
        const ticket = await TicketTest.getById();
        const response = await supertest(web)
            .delete(`/api/tickets/${ticket.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    // it('should reject remove show if theater is not found', async () => {
    //     const theater = await TheaterTest.getById();
    //     const response = await supertest(web)
    //         .delete(`/api/tickets/${theater.id + 1000}`)
    //         .set("X-API-TOKEN", "test");

    //     logger.debug(response.body);
    //     expect(response.status).toBe(404);
    //     expect(response.body.errors).toBeDefined();
    // });
});

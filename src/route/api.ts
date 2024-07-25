import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {ContactController} from "../controller/contact-controller";
import {AddressController} from "../controller/address-controller";
import { TheaterController } from "../controller/theater-controller";
import { ShowController } from "../controller/show-controller";
import { uploadMiddleware } from "../middleware/upload-middleware";
import {ShowtimeController} from "../controller/showtime-controller";
import { TicketController } from "../controller/ticket-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User APi
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// Contact API
apiRouter.post("/api/contacts",uploadMiddleware, ContactController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.get);
apiRouter.patch("/api/contacts/:contactId(\\d+)",uploadMiddleware, ContactController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.remove);
apiRouter.get("/api/contacts", ContactController.search);

// Address API
apiRouter.post("/api/contacts/:contactId(\\d+)/addresses", AddressController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.get);
apiRouter.patch("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.remove);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses", AddressController.list);

// Theater Api
apiRouter.post("/api/theaters", uploadMiddleware, TheaterController.create);
apiRouter.get("/api/theaters/current", TheaterController.get);
apiRouter.get('/api/theaters/:theaterId(\\d+)', TheaterController.getById);
apiRouter.patch('/api/theaters/:theaterId(\\d+)',uploadMiddleware,  TheaterController.update)
apiRouter.delete('/api/theaters/:theaterId(\\d+)', TheaterController.remove);

// Show Api
apiRouter.post("/api/shows/:theaterId(\\d+)", ShowController.create);
apiRouter.get("/api/shows/:showId(\\d+)/theaters/:theaterId(\\d+)", ShowController.getById);
apiRouter.get("/api/shows/current", ShowController.get);
apiRouter.patch("/api/shows/:showId(\\d+)/theaters/:theaterId(\\d+)", ShowController.update);
apiRouter.delete("/api/shows/:showId(\\d+)", ShowController.remove);
// apiRouter.get("/api/shows/:theaterId(\\d+)/shows", ShowController.list);

// // ticket Api
apiRouter.post("/api/tickets/", TicketController.create);
apiRouter.get("/api/tickets/:ticketId(\\d+)", TicketController.getById);
apiRouter.get("/api/tickets/", TicketController.get);
apiRouter.patch("/api/tickets/:ticketId(\\d+)/shows/:showId(\\d+)", ShowController.update);
// apiRouter.delete("/api/tickets/:ticketId(\\d+)", TicketController.remove);

// Showtime Api
apiRouter.post("/api/showtimes/:showId(\\d+)", ShowtimeController.create);
apiRouter.get("/api/showtimes/:showtimeId(\\d+)", ShowtimeController.getById);
apiRouter.get("/api/showtimes/current", ShowtimeController.get);
apiRouter.patch("/api/showtimes/:showtimeId(\\d+)", ShowtimeController.update);
apiRouter.delete("/api/showtimes/:showtimeId(\\d+)", ShowtimeController.remove);
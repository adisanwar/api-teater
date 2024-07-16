import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {ContactController} from "../controller/contact-controller";
import {AddressController} from "../controller/address-controller";
import { TheaterController } from "../controller/theater-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User APi
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// Contact API
apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.get);
apiRouter.patch("/api/contacts/:contactId(\\d+)", ContactController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.remove);
apiRouter.get("/api/contacts", ContactController.search);

// Address API
apiRouter.post("/api/contacts/:contactId(\\d+)/addresses", AddressController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.get);
apiRouter.patch("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.remove);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses", AddressController.list);

// Theater Api
apiRouter.post("/api/theaters", TheaterController.create);
apiRouter.get("/api/theaters/current", TheaterController.get);
apiRouter.get('/api/theaters/:theaterId(\\d+)', TheaterController.getById);
apiRouter.patch('/api/theaters/:theaterId(\\d+)', TheaterController.update)
apiRouter.delete('/api/theaters/:theaterId(\\d+)', TheaterController.remove);
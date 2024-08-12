import express from "express";
import {UserController} from "../controller/user-controller";
import { OrderController } from "../controller/order-controller";

export const publicRouter = express.Router();
publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login);

// notification middleware
publicRouter.post("/api/orders/notifications", OrderController.handleMidtransNotification);

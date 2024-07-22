import {Request} from "express";
import {Ticket} from "@prisma/client";

export interface TicketRequest extends Request {
    ticket?: Ticket
}

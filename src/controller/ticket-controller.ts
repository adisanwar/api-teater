import { Request, Response, NextFunction } from "express";
import { logger } from "../application/logging";
import path from "path";
import { deleteOldFile, getDestinationFolder, handleFileUpload } from "../middleware/upload-middleware";
import { CreateTicketRequest, GetTicketRequest, UpdateTicketRequest } from "../model/ticket-model";
import { TicketService } from "../service/ticket-service";

export class TicketController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateTicketRequest = req.body as CreateTicketRequest;
            const showId = Number(req.params.showId);
            const contactId = Number(req.params.contactId);

            // Check if showId and contactId are valid numbers
            if (isNaN(showId) || isNaN(contactId)) {
                return res.status(400).json({ error: 'Invalid show ID or contact ID' });
            }

            request.showId = showId;
            request.contactId = contactId;

            getDestinationFolder('ticket');
            handleFileUpload(req, request);

            const response = await TicketService.create(contactId, request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TicketService.get();
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const contactId = Number(req.params.contactId);
            const showId = Number(req.params.showId);
            const ticketId = Number(req.params.ticketId);

            const request: GetTicketRequest = {
                id: ticketId,
                contactId: contactId,
                showId: showId
            };

            const response = await TicketService.getById(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const contactId = Number(req.params.contactId);
            const showId = Number(req.params.showId);
            const ticketId = Number(req.params.ticketId);

            const request: UpdateTicketRequest = {
                id: ticketId,
                contactId: contactId,
                showId: showId,
                ...req.body
            };

            const ticket = await TicketService.getById(request);

            if (ticket.photo) {
                deleteOldFile(path.join(__dirname, '..', '..', ticket.photo.toString()));
            }

            handleFileUpload(req, request);
            const response = await TicketService.update(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const ticketId = Number(req.params.ticketId);

            if (isNaN(ticketId)) {
                return res.status(400).json({ error: 'Invalid ticket ID' });
            }

            await TicketService.remove({ id: ticketId, showId: Number(req.params.showId), contactId: Number(req.params.contactId) });
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }
}

import { Request, Response, NextFunction } from "express";
import { logger } from "../application/logging";
import path from "path";
import {
  deleteOldFile,
  getDestinationFolder,
  handleFileUpload,
} from "../middleware/upload-middleware";
import {
  CreateTicketRequest,
  GetTicketRequest,
  RemoveTicketRequest,
  UpdateTicketRequest,
} from "../model/ticket-model";
import { TicketService } from "../service/ticket-service";

export class TicketController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateTicketRequest = {
        ...req.body,
        contactId: Number(req.body.contactId),
        showId: Number(req.body.showId),
      };

      // Ensure required fields are present
      if (!request.contactId || !request.showId) {
        return res.status(400).json({ error: "contactId and showId are required" });
      }
      
      getDestinationFolder('ticket');
      handleFileUpload(req, request);

      logger.debug("request : " + JSON.stringify(request));

      const response = await TicketService.create(request);
      logger.debug("response : " + JSON.stringify(response));
      console.log(response);
      res.status(200).json({
        data: response,
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
      const ticketId = Number(req.params.ticketId);

      const request: GetTicketRequest = {
        id: ticketId,
      };

      const response = await TicketService.getById(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const showId = Number(req.params.showId);
      const ticketId = Number(req.params.ticketId);

      const request: UpdateTicketRequest = {
        id: ticketId,
        showId: showId,
        ...req.body,
      };

      const ticket = await TicketService.getById(request);

      if (ticket.photo) {
        deleteOldFile(
          path.join(__dirname, "..", "..", ticket.photo.toString())
        );
      }

      handleFileUpload(req, request);
      const response = await TicketService.update(request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
        const ticketId: RemoveTicketRequest = { 
            id: Number(req.params.ticketId),
        };

        if (isNaN(ticketId.id) ) {
            return res.status(400).json({ error: 'Invalid ticketId' });
        }

        await TicketService.remove(ticketId);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}
}

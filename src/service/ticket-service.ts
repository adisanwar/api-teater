import { Contact, Show, Ticket, User } from "@prisma/client";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateTicketRequest,
  GetTicketRequest,
  RemoveTicketRequest,
  TicketResponse,
  toTicketResponse,
  UpdateTicketRequest,
} from "../model/ticket-model";
import { ShowService } from "./show-service";
import { TicketValidation } from "../validation/ticket-validation";
import path from "path";
import fs from "fs";
import { logger } from "../application/logging";

export class TicketService {
  static async create(request: CreateTicketRequest): Promise<TicketResponse> {
    const createRequest: any = Validation.validate(
      TicketValidation.CREATE,
      request
    );
    await this.checkShowMustExists(createRequest.showId);

    const record = {
      ...createRequest,
      showId: createRequest.showId,
      contactId: createRequest.contactId,
    };

    logger.debug("response : " + JSON.stringify(record));
    console.log(record);
    const ticket: any = await prismaClient.ticket.create({
      data: record,
    });

    return toTicketResponse(ticket);
  }

  static async checkShowMustExists(showId: number): Promise<void> {
    const show = await prismaClient.show.findUnique({
      where: {
        id: showId,
      },
    });

    if (!show) {
      throw new ResponseError(404, "Show not found");
    }
  }

  static async getById(request: GetTicketRequest): Promise<TicketResponse> {
    const getRequest = Validation.validate(TicketValidation.GET, request);

    const ticket = await prismaClient.ticket.findFirst({
      where: {
        id: getRequest.id,
      },
      include: {
        contact: true,
        show: true,
      },
    });

    if (!ticket) {
      throw new ResponseError(404, "Ticket not found");
    }

    return toTicketResponse(ticket);
  }

  static async get(): Promise<Ticket[]> {
    return await prismaClient.ticket.findMany({
      include: {
        contact: true,
        show: true,
      },
    });
  }

  static async update(request: UpdateTicketRequest): Promise<TicketResponse> {
    const updateRequest: any = Validation.validate(
      TicketValidation.UPDATE,
      request
    );
    await this.checkShowMustExists(updateRequest.showId);

    const ticket: any = await prismaClient.ticket.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return toTicketResponse(ticket);
  }


//   "errors": "EPERM: operation not permitted, unlink 'D:\\Programming\\api-teater\\test'"
  static async remove(request: RemoveTicketRequest): Promise<TicketResponse> {
    const removeRequest = Validation.validate(TicketValidation.REMOVE, request);

    const ticket = await prismaClient.ticket.findUnique({
      where: {
        id: removeRequest.id,
      },
    });

    if (!ticket) {
      throw new ResponseError(404, "Show not found");
    }

    if (ticket.photo) {
      fs.unlinkSync(path.resolve(ticket.photo)); // Remove the photo file if it exists
    }

    const response: any = await prismaClient.ticket.delete({
      where: {
        id: ticket.id,
      },
    });

    return toTicketResponse(response);
  }
}

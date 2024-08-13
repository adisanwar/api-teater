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
import { deleteOldFile } from "../middleware/upload-middleware";

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
      throw new ResponseError(404, "Ticket not found");
    }

    if (ticket.photo) {
      deleteOldFile(ticket.photo);
    }

    const response: any = await prismaClient.ticket.delete({
      where: {
        id: ticket.id,
      },
    });

    return toTicketResponse(response);
  }

//   static async shuffleTickets(): Promise<void> {
//     const tickets = await prisma.ticket.findMany();
//     const tempTickets = await prisma.tempTicket.findMany();

//     if (tickets.length < 6) {
//         if (tempTickets.length > 0) {
//             const shuffledTickets = fisherYatesShuffle(tickets);
//             // Perbarui tiket
//             await this.updateTickets(shuffledTickets);
//             // Kosongkan tabel sementara
//             await prisma.tempTicket.deleteMany({});
//         } else {
//             const shuffledTickets = fisherYatesShuffle(tickets);
//             await this.updateTickets(shuffledTickets);
//         }
//     } else {
//         if (tickets.length >= 6 && tempTickets.length > 0) {
//             const uniqueTickets = tickets.filter(t => !tempTickets.some(tt => tt.ticketId === t.id));
//             if (uniqueTickets.length > 0) {
//                 const shuffledTickets = fisherYatesShuffle(uniqueTickets);
//                 await this.updateTickets(shuffledTickets);
//                 await this.updateTempTickets(shuffledTickets);
//             } else {
//                 // Semua tiket ada di temp, kosongkan temp dan acak ulang
//                 await prisma.tempTicket.deleteMany({});
//                 const shuffledTickets = fisherYatesShuffle(tickets);
//                 await this.updateTickets(shuffledTickets);
//                 await this.updateTempTickets(shuffledTickets);
//             }
//         } else {
//             const shuffledTickets = fisherYatesShuffle(tickets);
//             await this.updateTickets(shuffledTickets);
//             await this.updateTempTickets(shuffledTickets);
//         }
//     }
// }

// static async updateTickets(shuffledTickets: any[]): Promise<void> {
//     for (const ticket of shuffledTickets) {
//         await prisma.ticket.update({
//             where: { id: ticket.id },
//             data: { /* perbarui kolom yang relevan di sini */ }
//         });
//     }
// }

// static async updateTempTickets(shuffledTickets: any[]): Promise<void> {
//     for (const ticket of shuffledTickets) {
//         await prisma.tempTicket.create({
//             data: {
//                 ticketId: ticket.id,
//                 userId: ticket.userId,
//                 shuffledAt: new Date(),
//                 // kolom tambahan jika ada
//             }
//         });
//     }
// }
}

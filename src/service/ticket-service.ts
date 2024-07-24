import { Contact, Show, Ticket } from "@prisma/client";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { CreateTicketRequest, GetTicketRequest, RemoveTicketRequest, TicketResponse, toTicketResponse, UpdateTicketRequest } from "../model/ticket-model";
import { ShowService } from "./show-service";
import { TicketValidation } from "../validation/ticket-validation";
import path from 'path';
import fs from 'fs';

export class TicketService {

    static async create(request: CreateTicketRequest): Promise<TicketResponse> {
        const createRequest: any = Validation.validate(TicketValidation.CREATE, request);
        // await ShowService.checkShowMustExists(request.showId);

        // const ticketData = {
        //     ...createRequest,
        //     contactId: contactId,
        //     showId: request.showId
        // };

        const ticket : any = await prismaClient.ticket.create({
            data: createRequest
        });

        return toTicketResponse(ticket);
    }

    static async checkShowMustExists(showId: number): Promise<void> {
        const show = await prismaClient.show.findUnique({
            where: { id: showId }
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
                showId: getRequest.showId,
                contactId: getRequest.contactId
            },
            include: {
                contact: true,
                show: true,
            }
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
            }
        });
    }

    static async update(request: UpdateTicketRequest): Promise<TicketResponse> {
        const updateRequest: any = Validation.validate(TicketValidation.UPDATE, request);
        await this.checkShowMustExists(updateRequest.showId);

        const ticket : any = await prismaClient.ticket.update({
            where: {
                id: updateRequest.id
            },
            data: updateRequest
        });

        return toTicketResponse(ticket);
    }

    static async remove(request: RemoveTicketRequest): Promise<TicketResponse> {
        const removeRequest = Validation.validate(TicketValidation.REMOVE, request);

        const ticket = await prismaClient.ticket.findUnique({
            where: {
                id: removeRequest.id
            }
        });

        if (!ticket) {
            throw new ResponseError(404, "Ticket not found");
        }

        if (ticket.photo) {
            fs.unlinkSync(path.resolve(ticket.photo)); // Remove the photo file if it exists
        }

        const deletedTicket : any = await prismaClient.ticket.delete({
            where: {
                id: removeRequest.id
            }
        });

        return toTicketResponse(deletedTicket);
    }
}

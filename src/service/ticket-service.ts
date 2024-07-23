import { Contact, Show, Ticket, User } from "@prisma/client";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { CreateTicketRequest, GetTicketRequest, RemoveTicketRequest, TicketResponse, toTicketResponse, UpdateTicketRequest } from "../model/ticket-model";
import { ShowService } from "./show-service";
import { TicketValidation } from "../validation/ticket-validation";
import path from 'path';
import fs from 'fs';

export class TicketService {

    static async create(contactId: Contact, request: CreateTicketRequest): Promise<TicketResponse> {
        const createRequest: any = Validation.validate(TicketValidation.CREATE, request);
        await ShowService.checkShowMustExists(contactId, request.showId);

        const ticketData = {
            ...createRequest,
            contactId: contactId.id,
            showId: request.showId
        };

        const ticket : any = await prismaClient.ticket.create({
            data: ticketData
        });

        return toTicketResponse(ticket);
    }

    static async checkShowMustExists(showId: number, ticketId: number): Promise<Ticket> {
        const ticket = await prismaClient.ticket.findFirst({
            where: {
                id: ticketId,
                show: {
                    id: showId
                }
            },
            include: {
                show: true
            }
        });

        if (!ticket) {
            throw new ResponseError(404, "Ticket not found");
        }

        return ticket;
    }

    static async getById(request: GetTicketRequest): Promise<TicketResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, request);
        await this.checkShowMustExists(getRequest.showId, getRequest.id);
        
        const ticket = await prismaClient.ticket.findFirst({
            where: {
                id: getRequest.id,
                show: {
                    id: getRequest.showId
                }
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
        const tickets = await prismaClient.ticket.findMany({
            include: {
                contact: true,
                show: true,
            }
        });
        return tickets;
    }

    static async update(request: UpdateTicketRequest): Promise<TicketResponse> {
        const updateRequest: any = Validation.validate(TicketValidation.UPDATE, request);
        await this.checkShowMustExists(updateRequest.showId, updateRequest.id);

        const ticket : any = await prismaClient.ticket.update({
            where: {
                id: updateRequest.id
            },
            data: updateRequest
        });

        return toTicketResponse(ticket);
    }

    static async remove(request: RemoveTicketRequest): Promise<TicketResponse> {
        const removeRequest = Validation.validate(TicketValidation.GET, request);

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

        const respon : any= await prismaClient.ticket.delete({
            where: {
                id: removeRequest.id
            }
        });

        return toTicketResponse(respon);
    }
}

import {Contact, Show, Ticket, User} from "@prisma/client";
import {Validation} from "../validation/validation";
import {AddressValidation} from "../validation/address-validation";
import {ContactService} from "./contact-service";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import { CreateTicketRequest, GetTicketRequest, RemoveTicketRequest, TicketResponse, toTicketResponse, UpdateTicketRequest } from "../model/ticket-model";
import { ShowService } from "./show-service";
import { TicketValidation } from "../validation/ticket-validation";
import path from 'path';
import fs from 'fs';

export class TicketService {

    static async create(contact: Contact, request: CreateTicketRequest): Promise<TicketResponse> {
        const createRequest: any = Validation.validate(TicketValidation.CREATE, request);
        await ShowService.checkShowMustExists(request.showId, request.contactId);

        const ticketData = {
            ...createRequest,
            contactId: contact.id,
            showId: request.showId
        };

        const ticket = await prismaClient.ticket.create({
            data: ticketData
        });

        return toTicketResponse(ticket);
    }

    static async checkShowMustExists(showId: number, ticketId: number): Promise<Ticket> {
        const ticket = await prismaClient.ticket.findFirst({
            where: {
                id: ticketId,
                showId: showId
            }
        });

        if (!ticket) {
            throw new ResponseError(404, "Contact not found");
        }

        return ticket;
    }

    static async getById(user: User, request: GetTicketRequest): Promise<TicketResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.showId);
        await this.checkShowMustExists(getRequest.showId, getRequest.id);
        
        const ticket : any = await prismaClient.ticket.findFirst({
            where: {
                id: getRequest.id,
                showId: getRequest.showId
            }
        })
        return toTicketResponse(ticket);
    }

    static async get(): Promise<Ticket[]> {
        const ticket = await prismaClient.ticket.findMany();
        return ticket;
    }

    static async update(user: User, request: UpdateTicketRequest): Promise<TicketResponse> {
        const updateRequest : any = Validation.validate(TicketValidation.UPDATE, request);
        await ContactService.checkContactMustExists(user.username, request.showId);
        await this.checkShowMustExists(updateRequest.showId, updateRequest.id);

        const ticket = await prismaClient.ticket.update({
            where: {
                id: updateRequest.id,
                showId: updateRequest.showId
            },
            data: updateRequest
        })

        return toTicketResponse(ticket);
    }

    static async remove(user: User, request: RemoveTicketRequest): Promise<TicketResponse> {
        const removeRequest = Validation.validate(TicketValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.showId);
        const ticket = await this.checkShowMustExists(removeRequest.showId, removeRequest.id);

        if (ticket.photo) {
            fs.unlinkSync(path.resolve(ticket.photo)); // Remove the photo file if it exists
        }

        const tickets = await prismaClient.ticket.delete({
            where: {
                id: removeRequest.id
            }
        });

        return toTicketResponse(tickets);
    }

    // static async list(user: User, contactId: number): Promise<Array<AddressResponse>> {
    //     await ContactService.checkContactMustExists(user.username, contactId);

    //     const addresses = await prismaClient.address.findMany({
    //         where:{
    //             contact_id: contactId
    //         }
    //     });

    //     return addresses.map((address) => toAddressResponse(address));
    // }

}

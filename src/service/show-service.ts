import {Contact, Show, Theater} from "@prisma/client";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, ShowResponse, toShowResponse, UpdateShowRequest } from "../model/show-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import { ShowValidation } from "../validation/show-valiidation";
import { ResponseError } from "../error/response-error";
import { logger } from "../application/logging";
import fs from "fs";
import path from "path";



export class ShowService {

    static async create(request: CreateShowRequest): Promise<ShowResponse> {
        const createRequest = Validation.validate(ShowValidation.CREATE, request);
        await this.checkTheaterMustExists(createRequest.theaterId);

        console.log(createRequest);
    
        const show : any = await prismaClient.show.create({
          data: createRequest,
        });
    
        logger.debug('record : ' + JSON.stringify(show));
        return toShowResponse(show);
      }

    static async checkTheaterMustExists(theaterId: number): Promise<Theater> {
        const theater = await prismaClient.theater.findFirst({
            where: {
                id: theaterId
            },
        });

        if (!theater) {
            throw new ResponseError(404, "Theater is not found");
        }

        return theater;
    } 
    
    static async checkShowMustExists(contact: Contact, ticketId: number): Promise<Show> {
        const ticket : any = await prismaClient.ticket.findFirst({
            where: {
                id: ticketId,
                contactId: contact.id
            }
        });

        if (!ticket) {
            throw new ResponseError(404, "Contact not found");
        }

        return ticket;
    }


    static async getById(request: GetShowRequest): Promise<ShowResponse> {
        const getRequest : any = Validation.validate(ShowValidation.GET, request);

        const show = await prismaClient.show.findFirst({
            where: {
                id: getRequest.id,
            },
            include : {
                theater: true,
            }
        });

        if (!show) {
            throw new ResponseError(404, `Show with ID ${getRequest.id} does not exist in theater ${getRequest.theaterId}.`);
        }

        return toShowResponse(show);
    }

    static async get(): Promise<Show[]> {
        const show = await prismaClient.show.findMany(
            {
                include : {
                    theater: true,
                }
            }
        );
        return show;
    }

    static async update(request: UpdateShowRequest): Promise<ShowResponse> {
        try {
            // Validate the incoming request object against the schema
            const updateRequest = Validation.validate(ShowValidation.UPDATE, request);
    
            // Ensure the show exists before attempting to update it
            const existingShow = await prismaClient.show.findUnique({
                where: {
                    id: updateRequest.id,
                },
            });
    
            if (!existingShow) {
                throw new ResponseError(404, `Show with ID ${updateRequest.id} not found.`);
            }
    
            // Proceed with updating the record in the database
            const updatedShow : any= await prismaClient.show.update({
                where: {
                    id: updateRequest.id,
                },
                data: updateRequest
            });
    
            // Convert the updated show entity to the response format
            return toShowResponse(updatedShow);
        } catch (error) {
            console.error('Validation or Update Error:', error);
            throw error; // Re-throw the error to be handled by the controller
        }
    }
    

    // static async update(request: UpdateShowRequest): Promise<ShowResponse> {
    //     try {
    //         // Validate the entire request object, not just individual fields
    //         const updateRequest = Validation.validate(ShowValidation.UPDATE.parse, request);
    
    //         // Proceed with updating the record
    //         const show : any = await prismaClient.show.update({
    //             where: {
    //                 id: updateRequest.id,
    //             },
    //             data: updateRequest
    //         });
    
    //         return toShowResponse(show);
    //     } catch (error) {
    //         console.error('Validation Error in Update:', error);
    //         throw error;
    //     }
    // }

    static async remove(showId: RemoveShowRequest): Promise<ShowResponse> {
        const show: any = await prismaClient.show.findUnique({
            where: {
                id: showId.id,
            },
        });

        if (!show) {
            throw new ResponseError(404, "Show not found");
        }

        if (show.photo !== null) {
            fs.unlinkSync(path.resolve(show.photo)); // Remove the photo file if it exists
        }

        // Delete related records first (e.g., tickets, showtimes)
        await prismaClient.ticket.deleteMany({
            where: {
                showId: showId.id,
            },
        });

        await prismaClient.showtime.deleteMany({
            where: {
                showId: showId.id,
            },
        });

        // Now delete the show
        await prismaClient.show.delete({
            where: {
                id: showId.id,
            },
        });

        return toShowResponse(show);
    }
}

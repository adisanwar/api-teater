import { Theater } from "@prisma/client";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { CreateTheaterRequest, RemoveTheaterRequest, TheaterResponse, toTheaterResponse, UpdateTheaterRequest } from "../model/theater-model";
import { TheaterValidation } from "../validation/theater-valiidation";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";


export class TheaterService {
    static async create(request: CreateTheaterRequest): Promise<TheaterResponse> {
        const createRequest: any = Validation.validate(TheaterValidation.CREATE, request);

        const theater = await prismaClient.theater.create({
            data: createRequest
        });
        logger.debug("record : " + JSON.stringify(theater));
        return toTheaterResponse(theater);
    }

    static async checkTheaterMustExists(theaterId: number): Promise<Theater> {
        const theater = await prismaClient.theater.findFirst({
            where: {
                id: theaterId
            }
        });

        if (!theater) {
            throw new ResponseError(404, "Theater is not found");
        }

        return theater;
    }

    static async get(): Promise<Theater[]> {
        const theater = await prismaClient.theater.findMany();
        return theater;
    }

    static async getById(theater: Theater): Promise<TheaterResponse> {
        return toTheaterResponse(theater);
    }


    static async update(request: UpdateTheaterRequest): Promise<TheaterResponse> {
        const updateRequest : any  = Validation.validate(TheaterValidation.UPDATE, request);
        
        const result = await prismaClient.theater.update({
            where: {
                 id: updateRequest.id },
            data: updateRequest
        });

        return toTheaterResponse(result);
    }

    static async remove(request: RemoveTheaterRequest): Promise<TheaterResponse> {
        const removeRequest = Validation.validate(TheaterValidation.GET, request); 
        const theater = await prismaClient.theater.delete({
            where: { 
                id: removeRequest.id 
            },
        });

        return toTheaterResponse(theater);
    }
   
}

import { Theater } from "@prisma/client";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { CreateTheaterRequest, TheaterResponse, toTheaterResponse, UpdateTheaterRequest } from "../model/theater-model";
import { TheaterValidation } from "../validation/theater-valiidation";
import { logger } from "../application/logging";


export class TheaterService {
    static async create(request: CreateTheaterRequest): Promise<TheaterResponse> {
        const createRequest: any = Validation.validate(TheaterValidation.CREATE, request);

        const theater = await prismaClient.theater.create({
            data: createRequest
        });
        logger.debug("record : " + JSON.stringify(theater));
        return toTheaterResponse(theater);
    }

    static async get(): Promise<Theater[]> {
        const theater = await prismaClient.theater.findMany();
        return theater;
    }

    static async getById(theater: Theater): Promise<TheaterResponse> {
        return toTheaterResponse(theater);
    }

    static async update(theater: Theater, request: UpdateTheaterRequest): Promise<TheaterResponse> {
        const updateRequest :any = Validation.validate(TheaterValidation.UPDATE, request);

        if (updateRequest.name) {
            theater.name = updateRequest.name;
        }

        if (updateRequest.location) {
            theater.location = updateRequest.location;
        }

        const result = await prismaClient.theater.update({
            where: {
                id: theater.id
            },
            data: theater
        });

        logger.debug("record : " + JSON.stringify(theater));
        return toTheaterResponse(result);
    }

    static async remove(theaterId: number): Promise<void> {
        await prismaClient.theater.delete({
            where: { id: theaterId },
        });
    }
    
}

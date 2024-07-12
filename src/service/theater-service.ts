import { Theater } from "@prisma/client";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { CreateTheaterRequest, TheaterResponse, toTheaterResponse, UpdateTheaterRequest } from "../model/theater-model";
import { TheaterValidation } from "../validation/theater-valiidation";


export class TheaterService {
    static async create(request: CreateTheaterRequest): Promise<TheaterResponse> {
        const createRequest: any = Validation.validate(TheaterValidation.CREATE, request);

        const theater = await prismaClient.theater.create({
            data: createRequest
        });

        return toTheaterResponse(theater);
    }

    static async get(theater: Theater): Promise<TheaterResponse> {
        return toTheaterResponse(theater);
    }

    static async update(theater: Theater, request: UpdateTheaterRequest): Promise<TheaterResponse> {
        const updateRequest = Validation.validate(TheaterValidation.UPDATE, request);

        const result = await prismaClient.theater.update({
            where: {
                id: theater.id
            },
            data: theater
        });

        return toTheaterResponse(result);
    }
}

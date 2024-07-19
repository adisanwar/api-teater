import {Show, Theater} from "@prisma/client";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, ShowResponse, toShowResponse, UpdateShowRequest } from "../model/show-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import { ShowValidation } from "../validation/show-valiidation";
import { ResponseError } from "../error/response-error";
import { request } from "express";
import { logger } from "../application/logging";
import { TheaterService } from "./theater-service";
import { toTheaterResponse } from "../model/theater-model";



export class ShowService {

   static async create(request: CreateShowRequest): Promise<ShowResponse> {
        const createRequest = Validation.validate(ShowValidation.CREATE, request);
        await this.checkTheaterMustExists(createRequest.theaterId);

        const show = await prismaClient.show.create({
            data: createRequest
        });
        logger.debug("record : " + JSON.stringify(show));
        return toShowResponse(show);
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

    static async getById(request: GetShowRequest): Promise<ShowResponse> {
        const getRequest = Validation.validate(ShowValidation.GET, request);
        await this.checkTheaterMustExists(getRequest.theaterId);

        const show = await prismaClient.show.findFirst({
            where: {
                id: getRequest.id,
                theaterId: getRequest.theaterId,
            },
        });

        if (!show) {
            throw new ResponseError(404, `Show with ID ${getRequest.id} does not exist in theater ${getRequest.theaterId}.`);
        }

        return toShowResponse(show);
    }

    static async get(): Promise<Show[]> {
        const show = await prismaClient.show.findMany();
        return show;
    }

    static async update(request: UpdateShowRequest): Promise<ShowResponse> {
        const updateRequest = Validation.validate(ShowValidation.UPDATE, request);
        await this.checkTheaterMustExists(updateRequest.theaterId);

        const show = await prismaClient.show.update({
            where: {
                id: updateRequest.id,
                theaterId: updateRequest.theaterId
            },
            data: updateRequest
        });

        return toShowResponse(show);
    }

    static async remove(request: RemoveShowRequest) : Promise<ShowResponse> {
        const removeRequest = Validation.validate(ShowValidation.GET, request);

        const show = await prismaClient.show.delete({
            where: {
                id: removeRequest.id,
            }
        });

        return toShowResponse(show);
    }


}

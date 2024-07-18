import {Show, Theater} from "@prisma/client";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, ShowResponse, toShowResponse, UpdateShowRequest } from "../model/show-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import { ShowValidation } from "../validation/show-valiidation";
import { ResponseError } from "../error/response-error";
import { request } from "express";



export class ShowService {

    static async create(theater: Theater, request: CreateShowRequest): Promise<ShowResponse> {
        const createRequest : any  = Validation.validate(ShowValidation.CREATE, request);

        const record = {
            ...createRequest,
            ...{theater:theater.id}
        }
        const show = await prismaClient.show.create({
            data: record
        });

        return toShowResponse(show);
    }

    static async checkTheaterMustExist(theaterId: number, id: number): Promise <Show>{
        const theater = await prismaClient.theater.findFirst({ 
            where: { 
                id: theaterId } 
        });
        if (!theater) {
            throw new ResponseError(404, "Theater Not Found");
        }
    }

    static async getById(theater: Theater, request: GetShowRequest): Promise<ShowResponse> {
        const getRequest = Validation.validate(ShowValidation.GET, request);
        const show = await this.checkTheaterMustExist(getRequest.theaterId, getRequest.id );
        return toShowResponse(show);
    }

    static async get(): Promise<Show[]> {
        const show = await prismaClient.show.findMany();
        return show;
    }

    static async update(theater: Theater, request: UpdateShowRequest): Promise<ShowResponse> {
        const updateRequest = Validation.validate(ShowValidation.UPDATE, request);
        await this.checkTheaterMustExist(updateRequest.theaterId, updateRequest.id);

        const show = await prismaClient.show.update({
            where: {
               id: updateRequest.id,
               theaterId: theater.id
            },
            data: updateRequest
        });

        return toShowResponse(show);
    }

    static async remove(theater: Theater, request: RemoveShowRequest) : Promise<ShowResponse> {
        const removeRequest = Validation.validate(ShowValidation.GET, request);
        await this.checkTheaterMustExist(removeRequest.theaterId, removeRequest.id);

        const show = await prismaClient.show.delete({
            where: {
                id: removeRequest.id,
            }
        });

        return toShowResponse(show);
    }


}

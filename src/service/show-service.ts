import {Show, Theater} from "@prisma/client";
import { CreateShowRequest, GetShowRequest, ShowResponse, toShowResponse, UpdateShowRequest } from "../model/show-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import { ShowValidation } from "../validation/show-valiidation";
import { ResponseError } from "../error/response-error";



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
        const theater = await prismaClient.theater.findUnique({ 
            where: { 
                id: theaterId } 
        });
        if (!theater) {
            throw new ResponseError(404, "Theater Not Found");
        }
    }

    static async getById(theater: Theater, id: number): Promise<ShowResponse> {
        const contact = await this.checkTheaterMustExist(theater.id, id);
        return toShowResponse(contact);
    }

    static async get(): Promise<Show[]> {
        const show = await prismaClient.show.findMany();
        return show;
    }

    static async update(theater: Theater, request: UpdateShowRequest): Promise<ShowResponse> {
        const updateRequest = Validation.validate(ShowValidation.UPDATE, request);

        const show = await prismaClient.show.update({
            where: {
               id: updateRequest.id,
               theaterId: theater.id
            },
            data: updateRequest
        });

        return toShowResponse(show);
    }

    static async remove(theater: Theater, id: number) : Promise<ShowResponse> {
        await this.checkTheaterMustExist(theater.id, id);

        const show = await prismaClient.show.delete({
            where: {
                id: id,
                theaterId: theater.id
            }
        });

        return toShowResponse(show);
    }


}

import {Show, Theater, User} from "@prisma/client";
import { CreateShowRequest, ShowResponse, toShowResponse, UpdateShowRequest } from "../model/show-model";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import { ShowValidation } from "../validation/show-valiidation";


export class ShowService {

    static async create(theater: Theater, request: CreateShowRequest): Promise<ShowResponse> {
        const createRequest = Validation.validate(ShowValidation.CREATE, request);

        const record = {
            ...createRequest,
            ...{theater:theater.id}
        }
        const show = await prismaClient.show.create({
            data: record
        });

        return toShowResponse(show);
    }

    static async get(show : Show): Promise<ShowResponse> {
        return toShowResponse(show);
    }

    static async update(show: Show, request: UpdateShowRequest): Promise<ShowResponse> {
        const updateRequest = Validation.validate(ShowValidation.UPDATE, request);
       
        if (updateRequest.title) {
            show.title = updateRequest.title;
        }

        const result = await prismaClient.show.update({
            where: {
               id: show.id
            },
            data: show
        });

        return toShowResponse(result);
    }

   

}

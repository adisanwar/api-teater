import {Show, Showtime} from "@prisma/client";
import {Validation} from "../validation/validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {logger} from "../application/logging";
import {
    CreateShowtimeRequest,
    GetShowtimeRequest,
    ShowtimeResponse,
    toShowtimeResponse, UpdateShowtimeRequest
} from "../model/showtimes-model";
import {ShowtimeValidation} from "../validation/showtime-validation";

export class ShowtimeService {

    static async create(request: CreateShowtimeRequest): Promise<ShowtimeResponse> {
        const createRequest : any = Validation.validate(ShowtimeValidation.CREATE, request);

        const showtime = await prismaClient.showtime.create({
            data: createRequest
        });
        logger.debug("record : " + JSON.stringify(showtime));
        return toShowtimeResponse(showtime);
    }

    static async getById(request: GetShowtimeRequest): Promise<ShowtimeResponse> {
        const getRequest = Validation.validate(ShowtimeValidation.GET, request);

        const showtime = await prismaClient.showtime.findFirst({
            where: {
                id: getRequest.id,
            },
        });
        console.log(showtime);
        if (!showtime) {
            throw new ResponseError(404, `Show with ID ${getRequest.id} does not exist.`);
        }

        return toShowtimeResponse(showtime);
    }

    static async get(): Promise<Showtime[]> {
        const showtime = await prismaClient.showtime.findMany();
        return showtime;
    }

    static async update(request: UpdateShowtimeRequest): Promise<ShowtimeResponse> {
        const updateRequest = Validation.validate(ShowtimeValidation.UPDATE, request);
        const showtime = await prismaClient.showtime.update({
           
            where: {
                id: updateRequest.id,
            },
            data: updateRequest
        });

        return toShowtimeResponse(showtime);
    }

    static async remove(request: GetShowtimeRequest): Promise<ShowtimeResponse> {
        const showtime = await prismaClient.showtime.findUnique({
            where: {
                id: request.id
            }
        });

        if (!showtime) {
            throw new ResponseError(404, "Showtime not found");
        }

        await prismaClient.showtime.delete({
            where: {
                id: request.id
            }
        });

        return toShowtimeResponse(showtime);
    }

}

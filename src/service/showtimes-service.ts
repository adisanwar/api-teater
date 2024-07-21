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
import {ShowtimeValidation} from "../validation/showtime-valiidation";

export class ShowtimeService {

    static async create(request: CreateShowtimeRequest): Promise<ShowtimeResponse> {
        const createRequest  = Validation.validate(ShowtimeValidation.CREATE, request);
        await this.checkShowMustExists(createRequest.showId);

        const showtime = await prismaClient.showtime.create({
            data: createRequest
        });
        logger.debug("record : " + JSON.stringify(showtime));
        return toShowtimeResponse(showtime);
    }

    static async checkShowMustExists(showId: number): Promise<Show> {
        const show = await prismaClient.show.findFirst({
            where: {
                id: showId,

            }
        });

        if (!show) {
            throw new ResponseError(404, "Contact not found");
        }

        return show;
    }

    static async getById(request: GetShowtimeRequest): Promise<ShowtimeResponse> {
        const getRequest = Validation.validate(ShowtimeValidation.GET, request);
        await this.checkShowMustExists(getRequest.showId)

        const showtime = await prismaClient.showtime.findFirst({
            where: {
                id: getRequest.id,
                showId : getRequest.showId
            },
        });

        if (!showtime) {
            throw new ResponseError(404, `Show with ID ${getRequest.id} does not exist in theater ${getRequest.showId}.`);
        }

        return toShowtimeResponse(showtime);
    }

    static async get(): Promise<Showtime[]> {
        const showtime = await prismaClient.showtime.findMany();
        return showtime;
    }

    static async update(request: UpdateShowtimeRequest): Promise<ShowtimeResponse> {
        const updateRequest = Validation.validate(ShowtimeValidation.UPDATE, request);
        await this.checkShowMustExists(updateRequest.showId);

        const showtime = await prismaClient.showtime.update({
            where: {
                id: updateRequest.id,
                showId: updateRequest.showId
            },
            data: updateRequest
        });

        return toShowtimeResponse(showtime);
    }

    static async remove(showtimeId: number): Promise<ShowtimeResponse> {
        const showtime = await prismaClient.showtime.findUnique({
            where: {
                id: showtimeId
            }
        });

        if (!showtime) {
            throw new ResponseError(404, "Show not found");
        }

        await prismaClient.showtime.delete({
            where: {
                id: showtimeId
            }
        });

        return toShowtimeResponse(showtime);
    }

}

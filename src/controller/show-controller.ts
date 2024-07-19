import {UserRequest} from "../type/user-request";
import {Request, Response, NextFunction} from "express";
import { TheaterRequest } from "../type/theater-request";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, UpdateShowRequest } from "../model/show-model";
import { TheaterService } from "../service/theater-service";
import { logger } from "../application/logging";
import { ShowService } from "../service/show-service";

export class ShowController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);

            const request: CreateShowRequest = {
                ...req.body,
                theaterId: theaterId
            };

            const response = await ShowService.create(request);
            res.status(200).json({
                data: response
            });
            logger.debug("response : " + JSON.stringify(response));
        } catch (e) {
            next(e);
        }
    }
    
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await ShowService.get();
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);
            const showId = Number(req.params.showId);

            const request: GetShowRequest = {
                id: showId,
                theaterId: theaterId,
            };

            const response = await ShowService.getById(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);
            const showId = Number(req.params.showId);

            const request: UpdateShowRequest = {
                id: showId,
                theaterId: theaterId,
                ...req.body
            };

            const response = await ShowService.update(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
    
    // static async update(req: TheaterRequest, res: Response, next: NextFunction) {
    //     try {
    //         const request: UpdateShowRequest = req.body as UpdateShowRequest;
    //         request.id = Number(req.params.theaterId);

    //         const response = await ShowService.update(req.theater!, request);
    //         res.status(200).json({
    //             data: response
    //         });
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);
            const showId = Number(req.params.showId);

            const request: RemoveShowRequest = {
                id: showId,
                theaterId: theaterId,
            };

            const response = await ShowService.remove(request);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    // static async list(req: UserRequest, res: Response, next: NextFunction) {
    //     try {
    //         const contactId = Number(req.params.contactId);
    //         const response = await ShowService.list(req.theater!, contactId);
    //         res.status(200).json({
    //             data: response
    //         });
    //     } catch (e) {
    //         next(e);
    //     }
    // }

}

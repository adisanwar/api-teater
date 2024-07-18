import {UserRequest} from "../type/user-request";
import {Request, Response, NextFunction} from "express";
import { TheaterRequest } from "../type/theater-request";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, UpdateShowRequest } from "../model/show-model";
import { TheaterService } from "../service/theater-service";
import { logger } from "../application/logging";
import { ShowService } from "../service/show-service";

export class ShowController {

    static async create(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateShowRequest = req.body as CreateShowRequest;
            request.theaterId = Number(req.params.theaterId);

            const response = await ShowService.create(req.theater!, request);
            res.status(200).json({
                data: response
            });
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

    static async getById(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);
            const response = await ShowService.getById(req.theater!, theaterId);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
    
    static async update(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateShowRequest = req.body as UpdateShowRequest;
            request.id = Number(req.params.theaterId);

            const response = await ShowService.update(req.theater!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const showId = Number(req.params.showId);
            await ShowService.remove(req.theater!, showId);
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

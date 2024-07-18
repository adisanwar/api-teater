import {Request, Response, NextFunction} from "express";
import { CreateTheaterRequest, RemoveTheaterRequest, UpdateTheaterRequest } from "../model/theater-model";
import { TheaterService } from "../service/theater-service";
import { TheaterRequest } from "../type/theater-request";
import { logger } from "../application/logging";

export class TheaterController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateTheaterRequest = req.body as CreateTheaterRequest;
            const response = await TheaterService.create(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await TheaterService.get();
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId : any= Number(req.params.theaterId);
            if (isNaN(theaterId)) {
                return res.status(400).json({ error: 'Invalid theater ID' });
            }

            const response = await TheaterService.getById(theaterId);
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }


    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            // const request: UpdateTheaterRequest = req.body as UpdateTheaterRequest;
            // request.id = Number(req.params.theaterId)

            const theaterId = Number(req.params.theaterId);
            if (isNaN(theaterId)) {
                return res.status(400).json({ error: 'Invalid theater ID' });
            }

            const request: UpdateTheaterRequest = {
                id: theaterId,
                ...req.body
            };

            const response = await TheaterService.update(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const request : RemoveTheaterRequest = {
                id : Number(req.params.theaterId)
            }
            
            const response = await TheaterService.remove(request);

            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    // static async remove(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const theaterId = Number(req.params.theaterId);
    //         if (isNaN(theaterId)) {
    //             return res.status(400).json({ error: 'Invalid theater ID' });
    //         }

    //         await TheaterService.remove(theaterId);
    //         res.status(200).json({
    //             data: "OK"
    //         });
    //     } catch (e) {
    //         next(e);
    //     }
    // }

}

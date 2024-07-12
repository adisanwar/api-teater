import {Request, Response, NextFunction} from "express";
import { CreateTheaterRequest, UpdateTheaterRequest } from "../model/theater-model";
import { TheaterService } from "../service/theater-service";
import { TheaterRequest } from "../type/theater-request";

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

    static async get(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const response = await TheaterService.get(req.theater!);
            res.status(200).json({
               data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async update(req: TheaterRequest, res: Response, next: NextFunction) {
        try {
            const request : UpdateTheaterRequest = req.body as UpdateTheaterRequest;
            const response = await TheaterService.update(req.theater!, request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

}

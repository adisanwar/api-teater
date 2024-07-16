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

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);
            if (isNaN(theaterId)) {
                return res.status(400).json({ error: 'Invalid theater ID' });
            }

            await TheaterService.remove(theaterId);
            res.status(200).send(); // Mengembalikan status 204 No Content untuk penghapusan yang berhasil
        } catch (e) {
            next(e);
        }
    }

}

import {Request, Response, NextFunction} from "express";
import { logger } from "../application/logging";
import {CreateShowtimeRequest, GetShowtimeRequest, UpdateShowtimeRequest} from "../model/showtimes-model";
import {ShowtimeService} from "../service/showtimes-service";
import { Show } from "@prisma/client";
import { CreateContactRequest } from "../model/contact-model";
import { ShowRequest } from "../type/show-request";


export class ShowtimeController{

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const showID = Number(req.params.showId);                
            const request: CreateShowtimeRequest = {
                ...req.body,
                showId: showID
            };
            console.log(request);
            const response = await ShowtimeService.create(request);
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
            const response = await ShowtimeService.get();
            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const showtimeId = Number(req.params.showtimeId);
    
            if (isNaN(showtimeId)) {
                return res.status(400).json({ error: 'Invalid showtime ID' });
            }
    
            const request: GetShowtimeRequest = {
                id: showtimeId,
            };
    
            const response = await ShowtimeService.getById(request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
    

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const showtimeId = Number(req.params.showtimeId);
    
            if (isNaN(showtimeId)) {
                return res.status(400).json({ error: 'Invalid showtime ID' });
            }
    
            const { showId } = req.body;
    
            if (typeof showId !== 'number') {
                return res.status(400).json({ error: 'Invalid show ID' });
            }
    
            const request: UpdateShowtimeRequest = {
                id: showtimeId,
                showId: showId,
            };
    
            console.log(request);
            const response = await ShowtimeService.update(request.showId, request);
            res.status(200).json({
                data: response
            });
            logger.debug("response : " + JSON.stringify(response));
        } catch (e) {
            next(e);
        }
    }
    

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const showtimeId = Number(req.params.showtimeId);

            if (isNaN(showtimeId)) {
                return res.status(400).json({ error: 'Invalid show ID' });
            }

            const response = await ShowtimeService.remove(showtimeId);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

}

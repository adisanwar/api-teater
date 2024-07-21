import {UserRequest} from "../type/user-request";
import {Request, Response, NextFunction} from "express";
import { TheaterRequest } from "../type/theater-request";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, UpdateShowRequest } from "../model/show-model";
import { TheaterService } from "../service/theater-service";
import { logger } from "../application/logging";
import path from "path";
import { ShowService } from "../service/show-service";
import { deleteOldFile, getDestinationFolder, handleFileUpload } from "../middleware/upload-middleware";

export class ShowController {

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const theaterId = Number(req.params.theaterId);
            getDestinationFolder('show');
            handleFileUpload(req, theaterId);
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
            const show = await ShowService.getById({ theaterId, id: showId });
            
            const request: UpdateShowRequest = {
                id: showId,
                theaterId: theaterId,
                ...req.body
            };

            if (show.photo) {
                deleteOldFile(path.join(__dirname, '..', '..', show.photo));
              }
            handleFileUpload(req, request);
            const response = await ShowService.update(request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
    

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const showId = Number(req.params.showId);

            if (isNaN(showId)) {
                return res.status(400).json({ error: 'Invalid show ID' });
            }

            const response = await ShowService.remove(showId);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

}

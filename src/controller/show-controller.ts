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
            const theaterId = Number(req.body.theaterId);
      if (isNaN(theaterId)) {
        throw new Error('Invalid theaterId');
      }
            const request: CreateShowRequest = {
              ...req.body,
              theaterId: theaterId
            };
    
            handleFileUpload(req, request);
    
            console.log(request);
    
            const response = await ShowService.create(request);
            res.status(200).json({
              data: response,
            });
    
            console.log(response);
            logger.debug('response : ' + JSON.stringify(response));
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
            const showId = Number(req.params.showId);

            const request: GetShowRequest = {
                id: showId,
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
          console.log(req.body, req.params);
          const showId : any= parseInt(req.params.showId, 10);
    
          if (isNaN(showId)) {
            throw new Error('Invalid showId');
          }
    
          const show = await ShowService.getById(showId);
    
          const request: UpdateShowRequest = {
            id: showId,
            title: req.body.title,
            photo: req.body.photo,
            description: req.body.description,
            duration: req.body.duration,
            rating: req.body.rating
          };
    
          if (show.photo) {
            deleteOldFile(show.photo);
          }
    
          handleFileUpload(req, request);
    
          console.log(request);
    
          const response = await ShowService.update(request);
          res.status(200).json({
            data: response
          });
    
          console.log(response);
        } catch (e) {
          next(e);
        }
      }
    

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const showId: RemoveShowRequest = { 
                id: Number(req.params.showId),
            };

            if (isNaN(showId.id) ) {
                return res.status(400).json({ error: 'Invalid show or theater ID' });
            }

            await ShowService.remove(showId);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

}

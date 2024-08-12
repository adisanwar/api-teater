import { UserRequest } from "../type/user-request";
import { Request, Response, NextFunction, urlencoded } from "express";
import { TheaterRequest } from "../type/theater-request";
import { CreateShowRequest, GetShowRequest, RemoveShowRequest, toShowResponse, UpdateShowRequest } from "../model/show-model";
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

      if (isNaN(showId)) {
        return res.status(400).json({ error: 'Invalid show ID' });
      }

      const request = { id: showId };  // Create an object as expected by the service

      const response = await ShowService.getById(request);
      res.status(200).json({ data: response });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: TheaterRequest, res: Response, next: NextFunction) {
    try {
        const request: UpdateShowRequest = req.body as UpdateShowRequest;
        request.theaterId = Number(req.body.theaterId);
        request.showtimeId = Number(req.body.showtimeId);
        request.id = Number(req.params.showId);

        // Validate IDs
        if (isNaN(request.theaterId) || isNaN(request.showtimeId) || isNaN(request.id)) {
            return res.status(400).json({ error: 'Invalid theater or show ID' });
        }

        const show = await ShowService.getById(request);

        // Handle file deletion if a new photo is being uploaded
        if (show.photo) {
          deleteOldFile(path.join(__dirname, '..', '..', show.photo));
        }
        // Handle file upload
        handleFileUpload(req, request);

        // Proceed with the update
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
      const showId: RemoveShowRequest = {
        id: Number(req.params.showId),
      };

      if (isNaN(showId.id)) {
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

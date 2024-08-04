import { Request, Response, NextFunction } from "express";
import { CreateContactRequest, UpdateContactRequest, SearchContactRequest } from "../model/contact-model";
import { ContactService } from "../service/contact-service";
import { UserRequest } from "../type/user-request";
import { logger } from "../application/logging";
import path from "path";
import { deleteOldFile, getDestinationFolder, handleFileUpload } from "../middleware/upload-middleware";

export class ContactController {

    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateContactRequest = req.body as CreateContactRequest;
            // getDestinationFolder('contact');
            handleFileUpload(req, request);
            const response = await ContactService.create(req.user!, request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const contactId = Number(req.params.contactId);
            const response = await ContactService.get(req.user!, contactId);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const contact = await ContactService.get(req.user!, Number(req.params.contactId));
            const request: UpdateContactRequest = req.body as UpdateContactRequest;
            request.id = Number(req.params.contactId);
            getDestinationFolder('contact');
            if (contact.photo) {
                deleteOldFile(contact.photo);
              }
            handleFileUpload(req, request);

            const response = await ContactService.update(req.user!, request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const contactId = Number(req.params.contactId);
            const response = await ContactService.remove(req.user!, contactId);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: SearchContactRequest = {
                name: req.query.name as string,
                email: req.query.email as string,
                phone: req.query.phone as string,
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 10,
            };
            const response = await ContactService.search(req.user!, request);
            logger.debug("response : " + JSON.stringify(response));
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }
}

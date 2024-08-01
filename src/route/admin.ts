import { Router } from 'express';
import { AdminController } from '../controller/AdminController'; // Adjust the import as necessary
import { uploadMiddleware } from '../middleware/upload-middleware';

const adminRouter = Router();

adminRouter.post('/create-user-with-contact-and-address',uploadMiddleware, AdminController.createUserWithContactAndAddress);

export { adminRouter };

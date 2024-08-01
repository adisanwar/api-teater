import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../service/admin_user_service'; // Adjust the import as necessary
import { CreateUserRequest, UserResponse } from '../model/user-model'; // Adjust the import as necessary
import { CreateContactRequest, ContactResponse } from '../model/contact-model'; // Adjust the import as necessary
import { CreateAddressRequest, AddressResponse } from '../model/address-model'; // Adjust the import as necessary

export class AdminController {
  static async createUserWithContactAndAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, contact, address } = req.body;

      // Validate the incoming request body
      if (!user || !contact || !address) {
        return res.status(400).json({ error: 'User, contact, and address data are required' });
      }

      const createUserRequest: CreateUserRequest = user;
      const createContactRequest: CreateContactRequest = contact;
      const createAddressRequest: CreateAddressRequest = address;

      const result = await AdminService.createUserWithContactAndAddress({
        user: createUserRequest,
        contact: createContactRequest,
        address: createAddressRequest
      });

      res.status(201).json({
        user: result.user,
        contact: result.contact,
        address: result.address
      });
    } catch (error) {
      next(error);
    }
  }
}

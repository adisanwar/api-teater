import { prismaClient } from '../application/database'; // Adjust the import as necessary
import { Validation } from '../validation/validation'; // Adjust the import as necessary
import { UserValidation } from '../validation/user-validation';
import { ContactValidation } from '../validation/contact-validation';
import { AddressValidation } from '../validation/address-validation';
import { CreateUserRequest, UserResponse, toUserResponse } from '../model/user-model'; // Adjust the import as necessary
import { CreateContactRequest, ContactResponse, toContactResponse } from '../model/contact-model'; // Adjust the import as necessary
import { CreateAddressRequest, AddressResponse, toAddressResponse } from '../model/address-model'; // Adjust the import as necessary
import bcrypt from 'bcrypt';
import { ResponseError } from '../error/response-error'; // Adjust the import as necessary

export class AdminService {
  static async createUserWithContactAndAddress(request: {
    user: CreateUserRequest,
    contact: CreateContactRequest,
    address: CreateAddressRequest
  }): Promise<{ user: UserResponse, contact: ContactResponse, address: AddressResponse }> {
    const { user: userRequest, contact: contactRequest, address: addressRequest } = request;

    // Validate the input data
    const registerRequest = Validation.validate(UserValidation.REGISTER, userRequest);
    const createContactRequest = Validation.validate(ContactValidation.CREATE, contactRequest);
    const createAddressRequest = Validation.validate(AddressValidation.CREATE, addressRequest);

    // Set default value for isAdmin
    if (registerRequest.isAdmin === undefined) {
      registerRequest.isAdmin = false;
    }

    // Check if the username already exists
    const totalUserWithSameUsername = await prismaClient.user.count({
      where: { username: registerRequest.username }
    });

    if (totalUserWithSameUsername !== 0) {
      throw new ResponseError(400, "Username already exists");
    }

    // Hash the password
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    // Use a transaction to create the user, contact, and address
    const result = await prismaClient.$transaction(async (prisma) => {
      // Create the user
      const user = await prisma.user.create({
        data: registerRequest
      });

      // Create the contact
      const contacts= await prisma.contact.create({
        data: {
          ...createContactRequest,
          username: user.username
        }
      });

      // Create the address
      const address = await prisma.address.create({
        data: {
          ...createAddressRequest,
          contactId: contacts.id
        }
      });

      return { user, contacts, address };
    });

    return {
      user: toUserResponse(result.user),
      contact: toContactResponse(result.contacts),
      address: toAddressResponse(result.address)
    };
  }
}

import { User } from "@prisma/client";
import { ContactResponse, CreateContactRequest, toContactResponse } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";

export class ContactService {
    static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
        const createRequest = Validation.validate(ContactValidation.CREATE, request);

        const record: any = {
            first_name: createRequest.first_name,
            username: user.username,
        };

        // if (createRequest.last_name !== undefined) record.last_name = createRequest.last_name;
        // if (createRequest.email !== undefined) record.email = createRequest.email;
        // if (createRequest.phone !== undefined) record.phone = createRequest.phone;
        // if (createRequest.dateofbirth !== undefined) record.dateofbirth = createRequest.dateofbirth;
        // if (createRequest.ofcNo !== undefined) record.ofcNo = createRequest.ofcNo;
        // if (createRequest.nationalId !== undefined) record.nationalId = createRequest.nationalId;

        const contact = await prismaClient.contact.create({
            data: record
        });

        logger.debug("record : " + JSON.stringify(contact));
        return toContactResponse(contact);
    }
}

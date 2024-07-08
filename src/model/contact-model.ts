import { Contact } from "@prisma/client";

export type ContactResponse = {
    id: number;
    first_name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    dateofbirth?: Date | null;
    ofcNo?: string | null;
    nationalId?: bigint | null;  
}

export type CreateContactRequest = {

    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    dateofbirth?: Date;
    ofcNo?: string;
    nationalId?: bigint;  
}

export function toContactResponse(contact: Contact): ContactResponse {
    return {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        dateofbirth: contact.dateofbirth,
        ofcNo: contact.ofcNo,
        nationalId: contact.nationalId  
    }
}
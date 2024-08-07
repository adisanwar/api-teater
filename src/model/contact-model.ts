import {Contact} from "@prisma/client";

export type ContactResponse = {
    id: number;
    first_name: string;
    last_name?: string | null;
    photo?: string | null;
    email?: string | null;
    phone?: string | null;
    dateofbirth?: Date | null;
    ofcNo?: string | null;
    nationalId?:BigInt | null;
}

export type CreateContactRequest = {
    first_name: string;
    last_name?: string;
    photo?: string
    email?: string;
    phone?: string;
    dateofbirth?: Date;
    ofcNo?:String;
    nationalId?:BigInt;
}

export type UpdateContactRequest = {
    id: number;
    first_name: string;
    last_name?: string;
    photo?: string;
    email?: string;
    phone?: string;
    dateofbirth?: Date;
    ofcNo?:String;
    nationalId?:BigInt;
}

export type SearchContactRequest = {
    name?: string;
    phone?: string;
    email?: string;
    page: number;
    size: number;
}

export function toContactResponse(contact: Contact): ContactResponse {
    return {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        photo: contact.photo,
        email: contact.email,
        phone: contact.phone,
        dateofbirth: contact.dateofbirth,
        ofcNo:contact.ofcNo,
        nationalId:contact.nationalId
    }
}

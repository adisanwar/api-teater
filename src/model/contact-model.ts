import {Contact} from "@prisma/client";

export type ContactResponse = {
    id: number;
    fullname: string;
    photo?: string | null;
    email?: string | null;
    phone?: string | null;
    amount?: number | null;
    gender?: string | null;
    isGetTicket: Boolean;
    dateofbirth?: Date | null;
    ofcNo?: string | null;
    nationalId?:number | null;
}

export type CreateContactRequest = {
    fullname: string;
    photo?: string
    email?: string;
    phone?: string;
    amount?: number;
    gender?: string;
    isGetTicket: Boolean;
    dateofbirth?: Date;
    ofcNo?:string;
    nationalId?:number;
}

export type UpdateContactRequest = {
    id: number;
    fullname: string;
    photo?: string | null;
    email?: string | null;
    phone?: string | null;
    amount?: number | null;
    gender?: string | null;
    isGetTicket: Boolean;
    dateofbirth?: Date | null;
    ofcNo?: string | null;
    nationalId?:number | null;
}

export type SearchContactRequest = {
    fullname?: string;
    name?: string;
    phone?: string;
    email?: string;
    page: number;
    size: number;
}

export function toContactResponse(contact : Contact): ContactResponse {
    return {
        id: contact.id,
        fullname: contact.fullname,
        photo: contact.photo,
        email: contact.email,
        amount: contact.amount,
        gender: contact.gender,
        phone: contact.phone,
        isGetTicket: contact.isGetTicket,
        dateofbirth: contact.dateofbirth,
        ofcNo:contact.ofcNo,
        nationalId:contact.nationalId
    }
}

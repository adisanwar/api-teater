import { Contact, Show, Ticket } from "@prisma/client";
import { ContactResponse } from "./contact-model";
import { ShowResponse } from "./show-model";

export type TicketResponse = {
  id: number;
  seatNumber?: String | null;
  photo?: String | null,
  price?: String | null;
  purchaseDate?: Date | null;
  contact?: ContactResponse;
  show?: ShowResponse;
};

export type CreateTicketRequest = {
  seatNumber?: String;
  photo?: String;
  price?: String;
  purchaseDate?: Date;
  showId:number;
  contactId:number;
};

export type GetTicketRequest = {
  contactId:number;
  showId: number;
  id: number;
}

export type RemoveTicketRequest = GetTicketRequest

export type UpdateTicketRequest = {
  id: number;
  contactId:number;
  showId: number;
  seatNumber?: String;
  photo?: String;
  price?: String;
  purchaseDate?: Date;
};

// export type SearchTicketRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toTicketResponse(ticket: Ticket & {show: Show, contact: Contact} ): TicketResponse {
  return {
    id: ticket.id,
    seatNumber: ticket.seatNumber,
    photo: ticket.photo,
    price: ticket.price,
    purchaseDate: ticket.purchaseDate,
    contact: ticket.contact ? {
            id: ticket.contact.id,
            first_name: ticket.contact.first_name,
            last_name: ticket.contact.last_name,
            photo: ticket.contact.photo,
            email: ticket.contact.email,
            phone: ticket.contact.phone,
            dateofbirth: ticket.contact.dateofbirth,
            ofcNo: ticket.contact.ofcNo,
            nationalId: ticket.contact.nationalId  
    }: undefined,
    show: ticket.show ?{
            id: ticket.show.id,
            title: ticket.show.title,
            photo: ticket.show.photo,
            description: ticket.show.description,
            duration: ticket.show.duration,
            rating: ticket.show.rating,
    } : undefined
  };
}

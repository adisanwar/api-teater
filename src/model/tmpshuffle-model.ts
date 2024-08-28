import { Contact, Ticket, TmpShuffle } from "@prisma/client";
import { ContactResponse } from "./contact-model";
import { TicketResponse } from "./ticket-model";


export type ShuffleResponse = {
  id: number;
  isShuffle: boolean | null;
  contactId: number;
  ticketId: number;
  shuffledAt: Date | null;
  contact?: ContactResponse;
  ticket?: TicketResponse;
};

// export type CreateTicketRequest = {
//   seatNumber?: String;
//   photo?: String;
//   purchaseDate?: Date;
//   showId:number;
//   contactId:number;
// };

export type GetTicketRequest = {
  id: number;
}

// export type RemoveTicketRequest = GetTicketRequest

// export type UpdateTicketRequest = {
//   id: number;
//   contactId:number;
//   showId: number;
//   seatNumber?: String;
//   photo?: String;
//   price?: number;
//   purchaseDate?: Date;
// };

// export type SearchTicketRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toShuffleResponse(tmpShuffle: TmpShuffle & { ticket: Ticket, contact: Contact }): ShuffleResponse {
  return {
    id: tmpShuffle.id,
    isShuffle: tmpShuffle.isShuffle,
    contactId: tmpShuffle.contactId,
    ticketId: tmpShuffle.ticketId,
    shuffledAt: tmpShuffle.shuffledAt,
    contact: tmpShuffle.contact ? {
      id: tmpShuffle.contact.id,
      fullname: tmpShuffle.contact.fullname,
      photo: tmpShuffle.contact.photo,
      email: tmpShuffle.contact.email,
      phone: tmpShuffle.contact.phone,
      dateofbirth: tmpShuffle.contact.dateofbirth,
      ofcNo: tmpShuffle.contact.ofcNo,
      nationalId: tmpShuffle.contact.nationalId
    } : undefined,
    ticket: tmpShuffle.ticket ? {
      id: tmpShuffle.ticket.id,
      seatNumber: tmpShuffle.ticket.seatNumber,
      photo: tmpShuffle.ticket.photo,
      purchaseDate: tmpShuffle.ticket.purchaseDate,
      contactId: tmpShuffle.ticket.contactId,
      showId: tmpShuffle.ticket.showId,
    } : undefined
  };
}

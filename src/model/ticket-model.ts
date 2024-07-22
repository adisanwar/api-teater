import { Ticket } from "@prisma/client";

export type TicketResponse = {
  id: number;
  seatNumber?: String | null;
  photo?: String | null,
  price?: String | null;
  purchaseDate?: Date | null;
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

export function toTicketResponse(ticket: Ticket): TicketResponse {
  return {
    id: ticket.id,
    seatNumber: ticket.seatNumber,
    photo: ticket.photo,
    price: ticket.price,
    purchaseDate: ticket.purchaseDate,
  };
}

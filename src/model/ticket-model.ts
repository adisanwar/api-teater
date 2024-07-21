import { Ticket } from "@prisma/client";

export type ShowResponse = {
  id: number;
  seatNumber?: String | null;
  photo?: String | null,
  price?: String | null;
  purchaseDate?: Date | null;
};

export type CreateShowRequest = {
  seatNumber?: String;
  photo?: String;
  price?: String;
  purchaseDate?: Date;
};

export type UpdateShowRequest = {
  id: number;
  seatNumber?: String;
  photo?: String;
  price?: String;
  purchaseDate?: Date;
};

// export type SearchShowRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toShowResponse(ticket: Ticket): ShowResponse {
  return {
    id: ticket.id,
    seatNumber: ticket.seatNumber,
    photo: ticket.photo,
    price: ticket.price,
    purchaseDate: ticket.purchaseDate,
  };
}

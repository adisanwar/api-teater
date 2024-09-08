import { Order, Show, Ticket } from "@prisma/client";
import { TicketResponse } from "./ticket-model";
import { ShowResponse } from "./show-model";

export type OrderResponse = {
  id: number;
  orderId: string;
  amount?: number | null;
  status?: string | null;
  paymentUrl?: string | null;
  ticketId: number;
  ticket? : TicketResponse;
  show? : ShowResponse;
};

export type CreateOrderRequest = {
  orderId: string;
  amount: number;
  status: string;
  paymentUrl: string;
  ticketId: number;
};

export type UpdateOrderRequest = {
  id: number;
  orderId: string;
  amount: number;
  status: string;
  paymentUrl: string;
  ticketId: number;
};

export type GetOrderRequest = {
  id: number;
}

export type GetOrderIdRequest = {
  orderId: string;
}

export type RemoveOrderRequest = GetOrderRequest;

export function toOrderResponse(order: Order & {ticket : Ticket & {show : Show}}): OrderResponse {
  return {
    id: order.id,
    orderId: order.orderId,
    amount: order.amount,
    status: order.status,
    paymentUrl: order.paymentUrl,
    ticketId: order.ticketId,
    ticket: order.ticket ? {
      id: order.ticket.id,
      seatNumber: order.ticket.seatNumber,
      // photo: order.ticket.photo,
      purchaseDate: order.ticket.purchaseDate,
      contactId: order.ticket.contactId,
      showId: order.ticket.showId,
      show: {
        id: order.ticket.show.id,
        title: order.ticket.show.title,
        // photo: order.ticket.show.photo,
        description: order.ticket.show.description,
        duration: order.ticket.show.duration,
        rating: order.ticket.show.rating,
      }
  } : undefined,
  }
}

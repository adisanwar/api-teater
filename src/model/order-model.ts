import { Order } from "@prisma/client";

export type OrderResponse = {
  id: number;
  orderId: string;
  amount?: number | null;
  status?: string | null;
  paymentUrl?: string | null;
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

export type RemoveOrderRequest = GetOrderRequest;

export function toOrderResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    orderId: order.orderId,
    amount: order.amount,
    status: order.status,
    paymentUrl: order.paymentUrl,
  };
}

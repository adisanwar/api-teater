import { CreateOrderRequest, GetOrderRequest, OrderResponse, toOrderResponse } from '../model/order-model';
import { Validation } from '../validation/validation';
import { OrderValidation } from '../validation/order-validation';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';
import { Order, Ticket } from '@prisma/client';
import {Request, Response, NextFunction } from 'express';

export class OrderService {
    static async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
        const createRequest = Validation.validate(OrderValidation.CREATE, request);
        await this.checkTicketMustExists(createRequest.ticketId);

        const order = await prismaClient.order.create({
            data: createRequest
        });

        return toOrderResponse(order);
    }

    static async checkTicketMustExists(ticketId: number): Promise<Ticket> {
        const ticket = await prismaClient.ticket.findFirst({
          where: { id: ticketId },
        });
    
        if (!ticket) {
          throw new ResponseError(404, "Ticket not found");
        }
        return ticket;
    }

    static async get(): Promise<Order[]> {
        const order : any = await prismaClient.order.findMany();
        return order;
      }

   

    static async getOrderById(request: GetOrderRequest): Promise<OrderResponse> {
        const getRequest: any = Validation.validate(OrderValidation.GET, request);

        const order = await prismaClient.order.findUnique({
            where: { 
                id: getRequest.id
            },
        });

        if (!order) {
            throw new ResponseError(404, "Order not found");
        }

        return toOrderResponse(order);
    }

    static async updateOrderStatus(orderId: string, status: string): Promise<void> {
        await prismaClient.order.update({
          where: { orderId },
          data: { status },
        });
      }
}

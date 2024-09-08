import { CreateOrderRequest, GetOrderIdRequest, GetOrderRequest, OrderResponse, toOrderResponse } from '../model/order-model';
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

        const order : any = await prismaClient.order.create({
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

    static async get(): Promise<OrderResponse[]> {
      const orders = await prismaClient.order.findMany({
          include: {
              ticket:
              {
                include :{
                  show:true
                }
              }
          },
      }); // Retrieve all orders with the ticket relationship
  
      return orders.map(toOrderResponse); // Map over the array and convert each order to an OrderResponse
  }

   

    static async getOrderById(request: GetOrderRequest): Promise<OrderResponse> {
        const getRequest = Validation.validate(OrderValidation.GET, request);

        if (!getRequest || !getRequest.id) {
          throw new ResponseError(400, "Invalid request: Missing or invalid ID.");
      }
  
        const order : any = await prismaClient.order.findFirst({
            where: { 
                id: getRequest.id
            },
            // include: {
            //   ticket:true
            // }
        });

        if (!order) {
            throw new ResponseError(404, "Order not found");
        }

        return toOrderResponse(order);
    }

    static async getOrderByOrderId(request: GetOrderIdRequest): Promise<OrderResponse> {
      const getRequest = Validation.validate(OrderValidation.GETBYID, request);

      if (!getRequest || !getRequest.orderId) {
        throw new ResponseError(400, "Invalid request: Missing or invalid ID.");
    }

      const order : any = await prismaClient.order.findFirst({
          where: { 
              orderId: getRequest.orderId
          },
          // include: {
          //   ticket:true
          // }
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

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

   

  static async getById(request: GetOrderRequest): Promise<OrderResponse> {
    // Validate the request using Zod schema
    const getRequest = Validation.validate(OrderValidation.GET, request);

    // Check if the validation passed and `getRequest.id` exists
    if (!getRequest || typeof getRequest.id !== 'number') {
        throw new ResponseError(400, "Invalid request: Missing or invalid ID.");
    }

    // Fetch the order from the database using Prisma
    const order : any = await prismaClient.order.findFirst({
        where: { 
            id: getRequest.id
        },
        // include: {
        //     ticket: true, // Include related data if needed
        // }
    });

    // If no order is found, throw a 404 error
    if (!order) {
        throw new ResponseError(404, "Order not found");
    }

    // Convert the Prisma order result to the desired response format
    return toOrderResponse(order);
}


    static async getOrderByOrderId(request: GetOrderIdRequest): Promise<OrderResponse> {
      // Step 1: Validate the incoming request using Zod schema
      const getRequest = Validation.validate(OrderValidation.GETBYID, request);
  
      // Step 2: If validation fails or orderId is missing, throw an error
      if (!getRequest || !getRequest.orderId) {
        throw new ResponseError(400, "Invalid request: Missing or invalid ID.");
      }
  
      // Step 3: Fetch the order using Prisma
      const order: any = await prismaClient.order.findFirst({
          where: { 
              orderId: getRequest.orderId // Ensure this is a string (UUID)
          },
          // include: {
          //   ticket: true // Optionally include related ticket information
          // }
      });
  
      // Step 4: If the order is not found, throw a 404 error
      if (!order) {
          throw new ResponseError(404, "Order not found");
      }
  
      // Step 5: Return the order response in the expected format
      return toOrderResponse(order);
  }
  


  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    // Update the order status and get the ticketId in a single operation
    const order = await prismaClient.order.update({
        where: { orderId },
        data: { status }, // Update the order status with the received status
    });

    const ticketId = order.ticketId;

    // If the ticketId exists, update the ticket status
    if (ticketId) {
        const ticketStatus = status === "paid" ? "confirmed" : status; // Set ticket status to "confirmed" if the order status is "paid"

        await prismaClient.ticket.update({
            where: { id: ticketId },
            data: { status: ticketStatus }, // Update the ticket status
        });
    }
}

}

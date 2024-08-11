// src/controllers/orderController.ts
import { Request, Response, NextFunction } from "express";
import { OrderService } from "../service/order-service";
import { CreateOrderRequest } from "../model/order-model";
import midtransClient from "../application/midtrans-client";
import { prismaClient } from "../application/database";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate order IDs

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = Number(req.body.ticketId);
      if (isNaN(ticketId)) {
        throw new Error("Invalid ticketId");
      }

      const orderId = uuidv4();

      const request: CreateOrderRequest = {
        orderId: orderId,
        ticketId: ticketId,
        amount: req.body.amount,
        status: req.body.status || "pending",
        paymentUrl: "",
      };

      console.log(request);

      // Prepare parameters for Midtrans Snap API
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: request.amount,
        },
        credit_card: {
          secure: true,
        },
      };

      // Create transaction using Midtrans API
      const transaction = await midtransClient.createTransaction(parameter);

      // Create the order
      const createdOrder = await OrderService.createOrder(request);

      // Update order with payment URL returned by Midtrans
      const updatedOrder = await prismaClient.order.update({
        where: { id: createdOrder.id },
        data: {
          paymentUrl: transaction.redirect_url,
        },
      });

      res.status(200).json({
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId : any = Number(req.params.id);

      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

    //   console.log(orderId)

      const response = await OrderService.getOrderById(orderId);
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await OrderService.get();
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

//   static async handleMidtransNotification(req: Request, res: Response, next: NextFunction) {
//     try {
//       const notification = req.body;

//       // Verify the notification
//       const statusResponse = await midtransClient.transaction.notification(notification);

//       const orderId = statusResponse.order_id;
//       const transactionStatus = statusResponse.transaction_status;
//       const fraudStatus = statusResponse.fraud_status;

//       let status = 'pending';

//       if (transactionStatus === 'capture') {
//         if (fraudStatus === 'challenge') {
//           status = 'challenge';
//         } else if (fraudStatus === 'accept') {
//           status = 'paid';
//         }
//       } else if (transactionStatus === 'settlement') {
//         status = 'paid';
//       } else if (transactionStatus === 'deny') {
//         status = 'deny';
//       } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
//         status = 'canceled';
//       } else if (transactionStatus === 'pending') {
//         status = 'pending';
//       }

//       // Update the order status in your database
//       await OrderService.updateOrderStatus(orderId, status);

//       res.status(200).json({
//         message: 'Notification handled successfully',
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
}

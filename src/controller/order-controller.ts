// src/controllers/orderController.ts
import { Request, Response, NextFunction } from "express";
import { OrderService } from "../service/order-service";
import { CreateOrderRequest, GetOrderIdRequest, GetOrderRequest } from "../model/order-model";
import midtransClient from "../application/midtrans-client";
import { prismaClient } from "../application/database";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate order IDs
import { TicketService } from "../service/ticket-service";

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

      // const createdOrder = await OrderService.createOrder(request)

      //  const updatedOrder = await prismaClient.order.update({
      //   where: { id: createdOrder.id },
      //   data: {
      //     paymentUrl: "https://google.com",
      //   },
      // });

      const ticket = await prismaClient.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

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
      // Convert `req.params.id` to a number
      const orderId = Number(req.params.id);

      // Validate if orderId is a valid number
      if (isNaN(orderId) || orderId <= 0) {
        return res.status(400).json({ error: "Invalid or missing order ID" });
      }

      console.log("Id Order: " + orderId);

      // Construct the request object for the service layer
      const request: GetOrderRequest = { id: orderId };

      // Call the service to get the order by ID
      const response = await OrderService.getById(request);

      // Send the response back to the client
      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      // Forward the error to the error handler middleware
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

  static async handleMidtransNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const notification = req.body;

      // Extract the order ID from the notification
      const orderId = notification.order_id;

      // Get the transaction status from Midtrans
      const statusResponse = await midtransClient.transaction.status(orderId);

      console.log(statusResponse);
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      let status = "pending";

      switch (transactionStatus) {
        case "capture":
          status = fraudStatus === "challenge" ? "challenge" : "paid";
          break;
        case "settlement":
          status = "paid";
          break;
        case "deny":
          status = "deny";
          break;
        case "cancel":
        case "expire":
          status = "canceled";
          break;
        case "pending":
          status = "pending";
          break;
        default:
          throw new Error(`Unknown transaction status: ${transactionStatus}`);
      }

      // Update the order status in your database
      await OrderService.updateOrderStatus(orderId, status);

      res.status(200).json({
        message: "Notification handled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Finish Redirect Handler (when user is redirected after payment)
  static async handleFinishRedirect(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = String(req.query.order_id);

      if (!orderId) {
        return res.status(400).send('Missing order ID');
      }

      // Fetch the transaction status from Midtrans to ensure it's up to date
      const statusResponse = await midtransClient.transaction.status(orderId);
      const transactionStatus = statusResponse.transaction_status;

      // Redirect to success or failure page based on payment status
      if (transactionStatus === "settlement" || transactionStatus === "capture") {
        return res.redirect(`/payment/success?order_id=${orderId}`);
      } else {
        return res.redirect(`/payment/failure?order_id=${orderId}`);
      }
    } catch (error) {
      next(error);
    }
  }

}

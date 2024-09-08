import { z, ZodType } from "zod";

export class OrderValidation {
  static readonly CREATE: ZodType = z.object({
    ticketId: z.number().positive(),
    orderId: z.string().min(1).max(100).optional(),
    amount: z.number().positive().optional(),
    status: z.string().min(1).max(255).optional(),
  });

  static readonly GET: ZodType = z.object({
    id: z.number().positive(),
  });

  static readonly GETBYID: ZodType = z.object({
    orderId: z.string().uuid(), // Validate orderId as a UUID string
});


  static readonly REMOVE: ZodType = z.object({
    id: z.number().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    ticketId: z.number().positive(),
    orderId: z.string().min(1).max(100).optional(),
    amount: z.number().positive().optional(),
    status: z.string().min(1).max(255).optional(),
  });
}

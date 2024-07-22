import {z, ZodType} from "zod";

export class TicketValidation {

    static readonly CREATE : ZodType = z.object({
        showId: z.number().positive(),
        seatNumber: z.string().min(1).max(255).optional(),
        photo: z.string().min(1).max(100).optional(),
        price: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        purchaseDate: z.date().optional(),
    })

    static readonly GET : ZodType = z.object({
        showId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly REMOVE : ZodType = z.object({
        showId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly UPDATE : ZodType = z.object({
        id: z.number().positive(),
        showId: z.number().positive(),
        seatNumber: z.string().min(1).max(255).optional(),
        photo: z.string().min(1).max(100).optional(),
        price: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        purchaseDate: z.date().optional(),
    })

}

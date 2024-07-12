import {z, ZodType} from "zod";

export class TheaterValidation {

    static readonly CREATE : ZodType = z.object({
        theaterId: z.number().positive(),
        name: z.string().min(1).max(255).optional(),
        location: z.string().min(1).max(100).optional(),
        capacity: z.string().min(1).max(100).optional(),
    })

    static readonly GET : ZodType = z.object({
        theaterId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly REMOVE : ZodType = z.object({
        theaterId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly UPDATE : ZodType = z.object({
        theaterId: z.number().positive(),
        name: z.string().min(1).max(255).optional(),
        location: z.string().min(1).max(100).optional(),
        capacity: z.string().min(1).max(100).optional(),
    })

}

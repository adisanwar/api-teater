import {z, ZodType} from "zod";

export class ShowtimeValidation {

    static readonly CREATE : ZodType = z.object({
        showId: z.number().positive(),
        showDate: z.date().optional(),
        showTime: z.string().min(1).max(255).optional(),

        
    })
    static readonly GET : ZodType = z.object({
        showId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly REMOVE : ZodType = z.object({
        showId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        showId: z.number().positive(),
        showDate: z.date().optional(),
        showTime: z.string().min(1).max(255).optional(), // Correct field name
    });
}

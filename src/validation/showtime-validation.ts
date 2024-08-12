import {z, ZodType} from "zod";

export class ShowtimeValidation {

    static readonly CREATE: ZodType = z.object({
        showDate: z.string().min(1).max(255).optional(),
        showTime: z.string().min(1).max(255).optional(),
    });
    static readonly GET: ZodType = z.object({
        id: z.number().positive(),
    });
    static readonly REMOVE: ZodType = z.object({
        id: z.number().positive(),
    });
    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        showTime: z.string().min(1).max(255).optional(), 
        showDate: z.string().min(1).max(255).optional(),
    });
}

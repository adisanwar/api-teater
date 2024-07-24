import {z, ZodType} from "zod";

export class ShowValidation {

    static readonly CREATE : ZodType = z.object({
        theaterId: z.number().positive(),
        title: z.string().min(1).max(255).optional(),
        photo: z.string().min(1).max(255).optional(),
        description: z.string().min(1).max(100).optional(),
        duration: z.string().min(1).max(100).optional(),
        rating: z.string().min(1).max(100).optional()
        
    })

    static readonly GET : ZodType = z.object({
        theaterId: z.number().positive(),
        id: z.number().positive(),
    })

    static readonly REMOVE : ZodType = z.object({
        id: z.number().positive(),
    })

    static readonly UPDATE : ZodType = z.object({
        id: z.number().positive(),
        theaterId: z.number().positive(),
        title: z.string().min(1).max(255).optional(),
        photo: z.string().min(1).max(255).optional(),
        description: z.string().min(1).max(100).optional(),
        duration: z.string().min(1).max(100).optional(),
        rating: z.string().min(1).max(100).optional()
    })

}

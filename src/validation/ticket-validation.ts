import {z, ZodType} from "zod";

export class TicketValidation {

    static readonly CREATE : ZodType = z.object({
        contactId: z.number().positive(),
        showId: z.number().positive(),
        status: z.string().min(1).max(255),
    })

    static readonly GET : ZodType = z.object({
        id: z.number().positive(),
    })

    static readonly REMOVE : ZodType = z.object({
        id: z.number().positive(),
    })

    static readonly UPDATE : ZodType = z.object({
        id: z.number().positive(),
        contactId: z.coerce.number().positive(),  // Automatically converts strings to numbers
        showId: z.coerce.number().positive(),
    })

}

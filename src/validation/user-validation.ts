import {z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER : ZodType = z.object({
        username: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        token: z.string().min(1).max(100)
    })
}
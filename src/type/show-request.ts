import {Request} from "express";
import {Show} from "@prisma/client";

export interface ShowRequest extends Request {
    show?: Show
}

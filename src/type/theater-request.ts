import {Request} from "express";
import {Theater} from "@prisma/client";

export interface TheaterRequest extends Request {
    theater?: Theater
}

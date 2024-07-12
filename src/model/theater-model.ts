import {Theater} from "@prisma/client";

export type TheaterResponse = {
    id: Number;
    name: String,
    location?: String | null,
    capacity?: String | null,
}

export type CreateTheaterRequest = {
    name: String;
    location?: String;
    capacity?: String;
}

export type UpdateTheaterRequest = {
    id: Number;
    name: String;
    location?: String;
    capacity?: String;
}

// export type GetTheaterRequest = {
//     theterId: number;
//     id: number;
// }

// export type SearchTheaterRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toTheaterResponse(theater: Theater): TheaterResponse {
    return {
        id: theater.id,
        name: theater.name,
        location: theater.location,
        capacity: theater.capacity,
    }
}

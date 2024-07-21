import {Theater} from "@prisma/client";

export type TheaterResponse = {
    id: Number;
    name: String,
    photo?: String | null,
    location?: String | null,
    capacity?: String | null,
}

export type CreateTheaterRequest = {
    name: String;
    photo?: String;
    location?: String;
    capacity?: String;
}

export type GetTheaterRequest = {
    id: number;
}

export type RemoveTheaterRequest = GetTheaterRequest

export type UpdateTheaterRequest = {
    id:Number;
    name: String;
    photo?: String
    location?: String;
    capacity?: String;
}

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
        photo: theater.photo,
        location: theater.location,
        capacity: theater.capacity,
    }
}

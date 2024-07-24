import { Show, Theater } from "@prisma/client";
import { TheaterResponse } from "./theater-model";

export type ShowResponse = {
    id: number;
    title: string;
    photo?: string | null;
    description?: string | null;
    duration?: string | null;
    rating?: string | null;
    theater?: TheaterResponse;
}

export type CreateShowRequest = {
    title: string;
    photo?: string;
    description?: string;
    duration?: string;
    rating?: string;
    theaterId: number;
}

export type GetShowRequest = {
    theaterId: number;
    id: number;
}

export type RemoveShowRequest ={
    id:number
} 

export type UpdateShowRequest = {
    id: number;
    theaterId: number;
    title: string;
    photo?: string;
    description?: string;
    duration?: string;
    rating?: string;
}

// export type SearchShowRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toShowResponse(show: Show & {theater : Theater}): ShowResponse {
    return {
        id: show.id,
        title: show.title,
        photo: show.photo,
        description: show.description,
        duration: show.duration,
        rating: show.rating,
        theater: show.theater ? {
            id: show.theater.id,
            name: show.theater.name,
            location: show.theater.location,
            capacity: show.theater.capacity,
        } : undefined,
    }
}

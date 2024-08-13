import { Show, Showtime, Theater } from "@prisma/client";
import { TheaterResponse } from "./theater-model";
import { ShowtimeResponse } from "./showtimes-model";

export type ShowResponse = {
    id: number;
    title: string;
    photo?: string | null;
    description?: string | null;
    duration?: string | null;
    rating?: string | null;
    price?: number | null;
    theater?: TheaterResponse;
    showtime?: ShowtimeResponse;
}

export type CreateShowRequest = {
    title: string;
    photo?: string;
    description?: string;
    duration?: string;
    rating?: string;
    price?: number;
    theaterId: number;
    showtimeId:number;
}

export type GetShowRequest = {
    id: number;
}

export type RemoveShowRequest ={
    id:number
} 

export type UpdateShowRequest = {
    id: number;
    theaterId: number;
    showtimeId:number;
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

export function toShowResponse(show: Show & {theater : Theater, showtime : Showtime}): ShowResponse {
    return {
        id: show.id,
        title: show.title,
        photo: show.photo,
        description: show.description,
        duration: show.duration,
        rating: show.rating,
        price: show.price,
        theater: show.theater ? {
            id: show.theater.id,
            name: show.theater.name,
            location: show.theater.location,
            capacity: show.theater.capacity,
        } : undefined,
        showtime: show.showtime ? {
            id: show.showtime.id,
            showDate: show.showtime.showDate,
            showTime: show.showtime.showTime
        }: undefined
    }
}

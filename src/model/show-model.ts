import { Show } from "@prisma/client";

export type ShowResponse = {
    id: number;
    title: string;
    description?: string | null;
    duration?: string | null;
    rating?: string | null;
}

export type CreateShowRequest = {
    theaterId: number;
    title: string;
    description?: string;
    duration?: string;
    rating?: string;
}

export type GetShowRequest = {
    theaterId: number;
    id: number;
}

export type RemoveShowRequest = GetShowRequest

export type UpdateShowRequest = {
    id: number;
    title: string;
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

export function toShowResponse(show: Show): ShowResponse {
    return {
        id: show.id,
        title: show.title,
        description: show.description,
        duration: show.duration,
        rating: show.rating
    }
}

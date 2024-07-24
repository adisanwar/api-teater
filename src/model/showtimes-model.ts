import { Showtime } from "@prisma/client";

export type ShowtimeResponse = {
  id: number;
  showDate?: Date | null;
  showTime?: string | null;
};

export type CreateShowtimeRequest = {
  showDate?: Date;
  showTime?: string;
  showId: number;
};

export type GetShowtimeRequest = {
  id: number;
}

export type RemoveShowtimeRequest = GetShowtimeRequest

export type UpdateShowtimeRequest = {
  id: number;
  showId:number;
  showDate?: Date;
  showTime?: string;
};

// export type SearchShowRequest = {
//     name?: string;
//     phone?: string;
//     email?: string;
//     page: number;
//     size: number;
// }

export function toShowtimeResponse(showtime: Showtime): ShowtimeResponse {
  return {
    id: showtime.id,
    showDate: showtime.showDate,
    showTime: showtime.showTime
  };
}

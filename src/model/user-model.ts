import {User} from "@prisma/client";

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
    isAdmin?: boolean;
}

export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
    isAdmin: boolean;
}

export type LoginUserRequest = {
    username: string;
    password: string;
    isAdmin: boolean;
}

export type UpdateUserRequest = {
    name?: string;
    password?: string;
    isAdmin: boolean;
}

export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
    }
}

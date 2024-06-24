import { User } from "@prisma/client";

export type UserResponse = {
    username: string;
    name: string;
    token?:string;
}


export type CreateUserRequest = {
    username: string;
    name: string;
    token?:string;
}

export function ToUserResponse(user:User): UserResponse {
    return {
        name: user.name,
        username: user.username      
    }
}
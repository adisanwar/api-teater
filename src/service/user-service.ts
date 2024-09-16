import {
    CreateUserRequest,
    LoginUserRequest,
    toUserResponse,
    UpdateUserRequest,
    UserResponse
} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt, { compare } from "bcrypt";
import {v4 as uuid} from "uuid";
import {User} from "@prisma/client";

export class UserService {

    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        // Set default value for isAdmin
        if (registerRequest.isAdmin === undefined) {
            registerRequest.isAdmin = false;
        }

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username
            }
        });

        if (totalUserWithSameUsername != 0) {
            throw new ResponseError(400, "Username already exists");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: registerRequest
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if (!user) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Username or password is wrong");
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        });

        const response = toUserResponse(user);
        response.token = user.token!;
        return response;
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: user
        });

        return toUserResponse(result);
    }

    static async logout(user: User): Promise<UserResponse> {
        const result = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        });

        return toUserResponse(result);
    }

    static async getAll(): Promise<UserResponse[]> {
        const users = await prismaClient.user.findMany();
        return users.map(user => toUserResponse(user));
    }

    static async getById(username: string): Promise<UserResponse> {
        if (!username) {
            throw new ResponseError(400, "Username is required");
        }
    
        const user = await prismaClient.user.findUnique({
            where: {
                username: username,
            }
        });
    
        if (!user) {
            throw new ResponseError(404, "User not found");
        }
    
        return toUserResponse(user);
    }
    

    static async updateUser(username: string, request: UpdateUserRequest): Promise<UserResponse> {
        // Validate the update request
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);
    
        // Find the existing user
        const existingUser = await prismaClient.user.findUnique({
            where: {
                username: username
            }
        });
    
        if (!existingUser) {
            throw new ResponseError(404, "User not found");
        }
    
        // Create an update data object
        const updateData: any = {};
    
        if (updateRequest.name) {
            updateData.name = updateRequest.name;
        }
    
        if (updateRequest.password) {
            updateData.password = await bcrypt.hash(updateRequest.password, 10);
        }
    
        // Add a check for optional 'isAdmin' if needed
        if (updateRequest.isAdmin !== undefined) {
            updateData.isAdmin = updateRequest.isAdmin;
        }
    
        // Update the user with new data
        const result = await prismaClient.user.update({
            where: {
                username: username
            },
            data: updateData
        });
    
        return toUserResponse(result);
    }
    
    

    static async delete(username: string): Promise<void> {
        // Find the existing user
        const existingUser = await prismaClient.user.findUnique({
            where: {
                username: username
            }
        });
    
        if (!existingUser) {
            throw new ResponseError(404, "User not found");
        }
    
        // Find the associated contact
        const contact = await prismaClient.contact.findFirst({
            where: {
                username: username
            }
        });
    
        if (contact) {
            // Delete all addresses related to the contact
            await prismaClient.address.deleteMany({
                where: {
                    contactId: contact.id
                }
            });
    
            // Delete all tmp_shuffle entries related to the contact
            await prismaClient.tmpShuffle.deleteMany({
                where: {
                    contactId: contact.id
                }
            });
    
            // Delete all tickets related to the contact
            await prismaClient.ticket.deleteMany({
                where: {
                    contactId: contact.id
                }
            });
    
            // Delete the contact
            await prismaClient.contact.delete({
                where: {
                    id: contact.id
                }
            });
        }
    
        // Delete the user
        await prismaClient.user.delete({
            where: {
                username: username
            }
        });
    }
    
    
}



import {Request, Response, NextFunction} from "express";
import {CreateUserRequest, LoginUserRequest, RemoveUserRequest, UpdateUserRequest} from "../model/user-model";
import {UserService} from "../service/user-service";
import {UserRequest} from "../type/user-request";
import { ResponseError } from "../error/response-error";

export class UserController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;

            const response = await UserService.register(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await UserService.login(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.get(req.user!);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body as UpdateUserRequest;
            const response = await UserService.update(req.user!, request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            await UserService.logout(req.user!);
            res.status(200).json({
                data: "OK"
            })
        } catch (e) {
            next(e);
        }
    }

    // Get all users
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getAll();
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    // Get user by username
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const username: string = req.params.username;
            console.log(username);
            if (!username) {
                throw new ResponseError(400, "Username is required");
            }
            const response = await UserService.getById(username);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
    

    // Remove user by username (new method)
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const request: RemoveUserRequest = { username: req.params.username };
            await UserService.delete(request.username);
            res.status(204).send(); // No Content on successful deletion
        } catch (e) {
            next(e);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const username: string = req.params.username; // Ensure username is a string
            const request: UpdateUserRequest = req.body as UpdateUserRequest;
            const response = await UserService.updateUser(username, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
    

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const username: string = req.params.username;
            console.log(username)
            await UserService.delete(username);
            res.status(200).json({
                data : 'User Deleted'
            });
        } catch (e) {
            next(e);
        }
    }

}


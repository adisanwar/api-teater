import { request } from "express";
import {CreateUserRequest, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { prismaClient } from "../application/database"
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
      const registerRequest = Validation.validate(UserValidation.REGISTER, request);
  
      // Check if username already exists
      const totalUserWithSameUsername = await prismaClient.user.count({
        where: { 
            username: registerRequest.username
         },
      });
  
      if (totalUserWithSameUsername != 0) {
        throw new ResponseError(`400`); // Handle username conflict
      }
  
    //   // Implement user creation using Prisma or other methods
    //   const createdUser = await prismaClient.user.create({
    //     data: user,
    //   });
  
    //   // Return the response data (assuming UserResponse includes relevant data)
    //   return {
    //     id: createdUser.id,
    //     username: createdUser.username,
    //     // Include other relevant user details
      };
    }
  
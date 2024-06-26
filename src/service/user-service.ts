import { request } from "express";
import {CreateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { prismaClient } from "../application/database"
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";

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
        throw new ResponseError(400, "Username Already exist"); 

      }

      registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
      
      const user = await prismaClient.user.create({
        data: registerRequest
      });

      return toUserResponse(user);
      };
    }
  
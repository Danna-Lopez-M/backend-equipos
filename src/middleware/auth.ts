import { UserRepository } from "@repositories/userRepository";
import { UserService } from "@services/userService";
import { IUserRepository, IUserService, User } from "types/UserTypes";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = req.headers.authorization?.replace(/^Bearer\s+/, "") as string;
    
    if (!token) {
        return next(new Error("Token no proporcionado"));
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as User;
        const getUser = await userService.findById(decoded.id);

        if (!getUser) {
            return next(new Error("Usuario no encontrado"));
        }

        req.currentUser = getUser;
        next();
    } catch (error: any) {
        next(error);
    }
}
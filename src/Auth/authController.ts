import { UserRepository } from "@repositories/userRepository";
import { UserService } from "@services/userService";
import { IUserRepository, IUserService, User } from "types/UserTypes";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return void res.status(400).json({ errors: errors.array() });
        }

        const { email }: User = req.body;

        const userExists = await userService.findByEmail(email);
        if (userExists) {
            return void res.status(400).json({ message: "El usuario ya existe" });
        }
        
        const newUser = await userService.create(req.body);

        return void res.status(201).json(newUser);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        return void res.status(500).json({ message: errorMsg });
    }
};

export const validateRegisterUser = [
    body("email").isEmail().withMessage("El email no es válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const jwtSecret = process.env.JWT_SECRET as string;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return void res.status(400).json({ errors: errors.array() });
        }

        const { email, password }: User = req.body;

        const user = await userService.findByEmail(email);
        if (!user) {
            return void res.status(400).json({ message: "El usuario no existe" });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return void res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret as string, {
            expiresIn: 3600,
        });

        return void res.json({ token });
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        return void res.status(500).json({ message: errorMsg });
    }
}

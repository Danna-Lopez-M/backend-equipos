import { Request, Response } from "express";
import { IUserService, User } from "types/UserTypes";
import { body, param, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";

class UserController {
    constructor(private userService: IUserService) {}

    getUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.find();
            return void res.status(200).json(users);
        } catch (error) {
            return void res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    };

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return void res.status(400).json({ errors: errors.array() });
            }

            const newUser: User = req.body;
            const user = await this.userService.create(newUser);
            return void res.status(201).json(user);
        } catch (error) {
            return void res.status(500).json({ error: "Error al crear el usuario" });
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return void res.status(400).json({ error: "ID inválido" });
            }

            const user = await this.userService.findById(id);
            if (!user) {
                return void res.status(404).json({ error: "Usuario no encontrado" });
            }

            return void res.status(200).json(user);
        } catch (error) {
            return void res.status(500).json({ error: "Error al obtener el usuario" });
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return void res.status(400).json({ error: "ID inválido" });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return void res.status(400).json({ errors: errors.array() });
            }

            const data: Partial<User> = req.body;
            const user = await this.userService.update(id, data);
            if (!user) {
                return void res.status(404).json({ error: "Usuario no encontrado" });
            }

            return void res.status(200).json(user);
        } catch (error) {
            return void res.status(500).json({ error: "Error al actualizar el usuario" });
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return void res.status(400).json({ error: "ID inválido" });
            }

            const deleted = await this.userService.delete(id);
            if (!deleted) {
                return void res.status(404).json({ error: "Usuario no encontrado" });
            }

            return void res.status(200).json({ message: "Usuario eliminado con éxito" });
        } catch (error) {
            return void res.status(500).json({ error: "Error al eliminar el usuario" });
        }
    };

    // Validaciones con express-validator
    static validateUser = [
        body("name").isString().notEmpty().withMessage("El nombre es obligatorio"),
        body("email").isEmail().withMessage("El email no es válido"),
        body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    ];

    static validateId = [
        param("id").custom((value) => {
            if (!isValidObjectId(value)) {
                throw new Error("ID inválido");
            }
            return true;
        }),
    ];
}

export default UserController;

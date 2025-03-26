import { Router } from "express";
import { UserRepository } from "repositories/userRepository";
import { UserService } from "@services/userService";
import { RoleService } from "@services/roleService";
import { RoleRepository } from "@repositories/roleRepository";
import UserController from "controllers/UserController";
import RoleController from "controllers/RoleController";
import { registerUser, validateRegisterUser, loginUser  } from "@Auth/authController";
import asyncHandler from "../utils/asyncHandler";

//contratos
import { ContractService } from "@services/contractService";
import { ContractRepository } from "@repositories/contractRepository";
import ContractController from "@controllers/ContractController";

// Importar equipos
import { EquipmentService } from "@services/equipmentService";
import { EquipmentRepository } from "@repositories/equipmentRepository";
import EquipmentController from "controllers/EquipmentController";
import { verifyToken } from "@middleware/auth";
import { checkRole } from "@middleware/roles";

const router = Router();

// Crear instancias de los servicios y repositorios
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const roleRepository = new RoleRepository();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

// Instancias para contratos
const contractRepository = new ContractRepository();
const contractService = new ContractService(contractRepository);
const contractController = new ContractController(contractService);


// Instancias para equipos
const equipmentRepository = new EquipmentRepository();
const equipmentService = new EquipmentService(equipmentRepository);
const equipmentController = new EquipmentController(equipmentService);


export default () => {

    // Rutas de autenticación
    router.post("/auth/login", validateRegisterUser, loginUser);
    router.post("/auth/register", validateRegisterUser, checkRole, registerUser);

    // Rutas de usuarios
    router.get("/users", verifyToken, asyncHandler(userController.getUsers));
    router.post("/users", UserController.validateUser, verifyToken, checkRole, asyncHandler(userController.createUser));
    router.get("/users/:id", UserController.validateId, verifyToken, asyncHandler(userController.getUserById));
    router.put("/users/:id", UserController.validateId, UserController.validateUser, verifyToken, asyncHandler(userController.updateUser));
    router.delete("/users/:id", UserController.validateId, verifyToken, asyncHandler(userController.deleteUser));

    // Rutas de roles
    router.get("/roles", verifyToken, asyncHandler(roleController.getRoles));
    router.post("/roles", verifyToken, asyncHandler(roleController.createRole));
    router.get("/roles/:id", verifyToken, asyncHandler(roleController.getRoleById));
    router.put("/roles/:id", verifyToken, asyncHandler(roleController.updateRole));
    router.delete("/roles/:id", verifyToken, asyncHandler(roleController.deleteRole));

    // Rutas de contratos
    router.get("/contracts", verifyToken, asyncHandler(contractController.getContracts));
    router.post("/contracts", verifyToken, asyncHandler(contractController.createContract));
    router.get("/contracts/:id", verifyToken, asyncHandler(contractController.getContractById));
    router.put("/contracts/:id", verifyToken, asyncHandler( contractController.updateContract));
    router.delete("/contracts/:id", verifyToken, asyncHandler( contractController.deleteContract));

    //  Rutas de Equipos
    router.get("/equipments", verifyToken, asyncHandler( equipmentController.getEquipments));
    router.post("/equipments", verifyToken, asyncHandler( equipmentController.createEquipment));
    router.get("/equipments/:id", verifyToken, asyncHandler( equipmentController.getEquipmentById));
    router.put("/equipments/:id", verifyToken, asyncHandler( equipmentController.updateEquipment));
    router.delete("/equipments/:id", verifyToken, asyncHandler( equipmentController.deleteEquipment));

    // Ruta para asociar un equipo a un contrato
    router.put("/contracts/:id/add-equipment",  verifyToken, asyncHandler(contractController.addEquipmentToContract));

    return router;
};
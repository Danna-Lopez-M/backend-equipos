import { Request, Response } from "express";
import { IRoleService, Role } from "types/RolesTypes";

class RoleController {
    constructor(private roleService: IRoleService) {}

    getRoles = async (req: Request, res: Response) => {
        console.log("req getRoles", req.currentUser)
        const roles = await this.roleService.find();
        res.json(roles);
    };

    createRole = async (req: Request, res: Response) => {
        const newRole = req.body;
        const role = await this.roleService.create(newRole);
        res.json(role);
    };

    getRoleById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const role = await this.roleService.findById(id);
        res.json(role);
    };

    updateRole = async (req: Request, res: Response) => {
        const id = req.params.id;
        const data: Partial<Role> = req.body;
        const role = await this.roleService.update(id, data);
        res.json(role);
    };

    deleteRole = async (req: Request, res: Response) => {
        const id = req.params.id;
        const deleted = await this.roleService.delete(id);
        res.json(deleted);
    };
}

export default RoleController;
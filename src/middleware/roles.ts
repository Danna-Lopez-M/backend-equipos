import { RoleRepository } from '@repositories/roleRepository';
import { RoleService } from '@services/roleService';
import { IRoleRepository, IRoleService } from 'types/RolesTypes';
import e, { Request, Response, NextFunction } from 'express';

const roleRepository: IRoleRepository = new RoleRepository();
const roleService: IRoleService = new RoleService(roleRepository);

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
    const roles: string[] = req.body && req.body?.roles ? req.body.roles : [];
    const role = Array.isArray(roles) && roles.length != 0 ? roles : ["customer"];

    try {
        const findRoles = await roleService.find({ name: { $in: role }});

        if (findRoles.length === 0) {
            return next(new Error("Role not found"));
        }

        req.body.roles = findRoles.map(role => role._id);

        next();
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
}
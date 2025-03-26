import { Query } from "types/RepositoryTypes";
import { IRoleRepository, IRoleService, Role } from "types/RolesTypes";

export class RoleService implements IRoleService {
    private roleRepository: IRoleRepository

    constructor(roleRepository: IRoleRepository) {
        this.roleRepository = roleRepository;
    }

    async create(data: Role): Promise<Role> {
        return this.roleRepository.create(data);
    }

    async find(query?: Query): Promise<Role[]> {
        return this.roleRepository.find(query);
    }

    async findById(id: string): Promise<Role | null> {
        return this.roleRepository.findById(id);
    }

    async update(id: string, data: Partial<Role>): Promise<Role | null> {
        return this.roleRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return this.roleRepository.delete(id);
    } 
}
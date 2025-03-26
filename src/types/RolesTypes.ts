import { Query, Repository } from "./RepositoryTypes";
import { Document } from "mongoose";

export interface Role extends Document {
    name: string;
    permissions: string[];
};

export interface IRoleRepository extends Repository<Role> {};

export interface IRoleService {
    create(data: Role): Promise<Role>;
    find(query?: Query): Promise<Role[]>;
    findById(id: string): Promise<Role | null>;
    update(id: string, data: Partial<Role>): Promise<Role | null>;
    delete(id: string): Promise<boolean>;
};
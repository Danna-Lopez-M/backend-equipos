import { Query, Repository } from "./RepositoryTypes";
import { Document } from "mongoose";
import { Role } from "./RolesTypes";
export interface User extends Document {
    name: string;
    email: string;
    password: string;
    roles?: Role[];
    permissions?: string[];
    comparePassword(password: string): Promise<boolean>;
};

export interface IUserRepository extends Repository<User> {
    findOne(query: Query): Promise<User | null>;
};

export interface IUserService {
    create(data: User): Promise<User>;
    find(query?: Query): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
};
import { Query, Repository } from "./RepositoryTypes";

export interface Equipment {
    name: string;
    type: string;
    brand: string;
    model: string;
    description: string;
    price: number;
    stock: number;
    warrantyPeriod: string;
    releaseDate: Date;
    specifications: Record<string, any>;
}

export interface IEquipmentRepository extends Repository<Equipment> {}

export interface IEquipmentService {
    create(data: Equipment): Promise<Equipment>;
    find(query?: Query): Promise<Equipment[]>;
    findById(id: string): Promise<Equipment | null>;
    update(id: string, data: Partial<Equipment>): Promise<Equipment | null>;
    delete(id: string): Promise<boolean>;
}

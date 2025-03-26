import { Equipment } from "./EquipmentTypes";
import { Query, Repository } from "./RepositoryTypes";

export interface Contract extends Document {
    customerId: string;
    contractNumber: string;
    startDate: Date;
    endDate: Date;
    monthlyCost: number;
    active: boolean;
    equipments: Equipment[];
}

export interface IContractRepository extends Repository<Contract> {}

export interface IContractService {
    create(data: Contract): Promise<Contract>;
    find(query?: Query): Promise<Contract[]>;
    findById(id: string): Promise<Contract | null>;
    update(id: string, data: Partial<Contract>): Promise<Contract | null>;
    delete(id: string): Promise<boolean>;
    addEquipment(contractId: string, equipmentId: string): Promise<Contract | null>;
}

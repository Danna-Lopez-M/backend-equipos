import { Contract, IContractRepository, IContractService } from "../types/ContractTypes";
import { Query } from "types/RepositoryTypes";
import { ContractModel } from "../models/Contracts";
import mongoose from "mongoose";


export class ContractService implements IContractService {
    private contractRepository: IContractRepository;

    constructor(contractRepository: IContractRepository) {
        this.contractRepository = contractRepository;
    }

    async create(data: Contract): Promise<Contract> {
        return this.contractRepository.create(data);
    }

    async find(query?: Query): Promise<Contract[]> {
        return this.contractRepository.find(query);
    }

    async findById(id: string): Promise<Contract | null> {
        return this.contractRepository.findById(id);
    }

    async update(id: string, data: Partial<Contract>): Promise<Contract | null> {
        return this.contractRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return this.contractRepository.delete(id);
    }

    async addEquipment(contractId: string, equipmentId: string) {
        if (!mongoose.Types.ObjectId.isValid(contractId)) {
            throw new Error("Invalid contract ID");
        }

        return ContractModel.findByIdAndUpdate(
            contractId,
            { $addToSet: { equipments: equipmentId } },
            { new: true }
        ).populate("equipments");
    }
}

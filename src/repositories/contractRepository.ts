import { ContractModel } from "@models/Contracts";
import { Contract, IContractRepository } from "types/ContractTypes";
import { Query } from "types/RepositoryTypes";

export class ContractRepository implements IContractRepository {

    async create(data: Contract): Promise<Contract> {
        const newContract = new ContractModel(data);
        return await newContract.save();
    }

    async find(query?: Query): Promise<Contract[]> {
        return await ContractModel.find(query || {}).exec();
    }

    async findById(id: string): Promise<Contract | null> {
        return await ContractModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Contract>): Promise<Contract | null> {
        return await ContractModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await ContractModel.findByIdAndDelete(id).exec();
        return deleted != null;
    }
}

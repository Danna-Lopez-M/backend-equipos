import { EquipmentModel } from "@models/Equipment";
import { Query } from "types/RepositoryTypes";
import { IEquipmentRepository, Equipment } from "types/EquipmentTypes";

export class EquipmentRepository implements IEquipmentRepository {
    async create(data: Equipment): Promise<Equipment> {
        const newEquipment = new EquipmentModel(data);
        return await newEquipment.save();
    }

    async find(query?: Query): Promise<Equipment[]> {
        return await EquipmentModel.find(query || {}).exec();
    }

    async findById(id: string): Promise<Equipment | null> {
        return await EquipmentModel.findById(id).exec();
    }

    async update(id: string, data: Partial<Equipment>): Promise<Equipment | null> {
        return await EquipmentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await EquipmentModel.findByIdAndDelete(id).exec();
        return deleted != null;
    }
}

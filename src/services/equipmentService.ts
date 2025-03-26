import { Query } from "types/RepositoryTypes";
import { IEquipmentRepository, IEquipmentService, Equipment } from "types/EquipmentTypes";

export class EquipmentService implements IEquipmentService {
    private equipmentRepository: IEquipmentRepository;

    constructor(equipmentRepository: IEquipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    async create(data: Equipment): Promise<Equipment> {
        return this.equipmentRepository.create(data);
    }

    async find(query?: Query): Promise<Equipment[]> {
        return this.equipmentRepository.find(query);
    }

    async findById(id: string): Promise<Equipment | null> {
        return this.equipmentRepository.findById(id);
    }

    async update(id: string, data: Partial<Equipment>): Promise<Equipment | null> {
        return this.equipmentRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return this.equipmentRepository.delete(id);
    }
}

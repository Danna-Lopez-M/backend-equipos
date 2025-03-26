import { Request, Response } from "express";
import { IEquipmentService, Equipment } from "types/EquipmentTypes";

class EquipmentController {
    constructor(private equipmentService: IEquipmentService) {}

    getEquipments = async (req: Request, res: Response) => {
        const equipments = await this.equipmentService.find();
        res.json(equipments);
    };

    createEquipment = async (req: Request, res: Response) => {
        const newEquipment = req.body;
        const equipment = await this.equipmentService.create(newEquipment);
        res.json(equipment);
    };

    getEquipmentById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const equipment = await this.equipmentService.findById(id);
        res.json(equipment);
    };

    updateEquipment = async (req: Request, res: Response) => {
        const id = req.params.id;
        const data: Partial<Equipment> = req.body;
        const equipment = await this.equipmentService.update(id, data);
        res.json(equipment);
    };

    deleteEquipment = async (req: Request, res: Response) => {
        const id = req.params.id;
        const deleted = await this.equipmentService.delete(id);
        res.json(deleted);
    };
}

export default EquipmentController;

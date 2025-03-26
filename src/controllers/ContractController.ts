import { Contract, IContractService } from "types/ContractTypes";
import { Request, Response } from "express";
import { ContractService } from "@services/contractService";


class ContractController {
    constructor(private contractService: IContractService) {}

    getContracts = async (req: Request, res: Response) => {
        const contracts = await this.contractService.find();
        res.json(contracts);
    };

    createContract = async (req: Request, res: Response): Promise<void> => {
        const newContract: Contract = req.body;
        const contract = await this.contractService.create(newContract);
        res.json(contract);
    };

    getContractById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const contract = await this.contractService.findById(id);
        res.json(contract);
    };

    updateContract = async (req: Request, res: Response) => {
        const id = req.params.id;
        const data: Partial<Contract> = req.body;
        const contract = await this.contractService.update(id, data);
        res.json(contract);
    };

    deleteContract = async (req: Request, res: Response) => {
        const id = req.params.id;
        const deleted = await this.contractService.delete(id);
        res.json(deleted);
    };

    addEquipmentToContract = async (req: Request, res: Response): Promise<void> => {
        try {
            const contractId = req.params.id;
            const { equipmentId } = req.body;
            const updatedContract = await this.contractService.addEquipment(contractId, equipmentId);
            if (!updatedContract) {
                res.status(404).json({ error: "Contrato no encontrado" });
                return;
            }
            res.json(updatedContract);
        } catch (error) {
            res.status(500).json({ error: "Error al asociar el equipo al contrato" });
        }
    };

}

export default ContractController;

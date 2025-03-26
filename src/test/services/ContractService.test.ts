import { ContractService } from '../../services/contractService';
import { Contract, IContractRepository } from "../../types/ContractTypes";
import { ContractModel } from "../../models/Contracts";

const mockContractRepository: jest.Mocked<IContractRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("Contract Service Test", () => {
    let contractService: ContractService;

    beforeEach(() => {
        contractService = new ContractService(mockContractRepository);
        jest.clearAllMocks();
    });

    it("Crear un contrato", async () => {
        const contractData: Contract = {
            _id: "1",
            customerId: "123",
            contractNumber: "C-001",
            startDate: new Date(),
            endDate: new Date(),
            monthlyCost: 100,
            active: true,
            equipments: [],
        } as unknown as Contract;
        mockContractRepository.create.mockResolvedValue(contractData);

        const result = await contractService.create(contractData);
        expect(result).toEqual(contractData);
        expect(mockContractRepository.create).toHaveBeenCalledWith(contractData);
    });

    it("Encontrar contratos", async () => {
        const contracts: Contract[] = [
            {
                _id: "1",
                customerId: "123",
                contractNumber: "C-001",
                startDate: new Date(),
                endDate: new Date(),
                monthlyCost: 100,
                active: true,
                equipments: [],
            } as unknown as Contract,
        ];
        mockContractRepository.find.mockResolvedValue(contracts);

        const result = await contractService.find();
        expect(result).toEqual(contracts);
        expect(mockContractRepository.find).toHaveBeenCalled();
    });

    it("Encontrar contrato por ID", async () => {
        const contract: Contract = {
            _id: "1",
            customerId: "123",
            contractNumber: "C-001",
            startDate: new Date(),
            endDate: new Date(),
            monthlyCost: 100,
            active: true,
            equipments: [],
        } as unknown as Contract;
        mockContractRepository.findById.mockResolvedValue(contract);

        const result = await contractService.findById("1");
        expect(result).toEqual(contract);
        expect(mockContractRepository.findById).toHaveBeenCalledWith("1");
    });

    it("Actualizar contrato", async () => {
        const updatedContract: Contract = {
            _id: "1",
            customerId: "123",
            contractNumber: "C-001",
            startDate: new Date(),
            endDate: new Date(),
            monthlyCost: 150,
            active: true,
            equipments: [],
        } as unknown as Contract;
        mockContractRepository.update.mockResolvedValue(updatedContract);

        const result = await contractService.update("1", { monthlyCost: 150 });
        expect(result).toEqual(updatedContract);
        expect(mockContractRepository.update).toHaveBeenCalledWith("1", { monthlyCost: 150 });
    });


    it("Eliminar contrato", async () => {
        mockContractRepository.delete.mockResolvedValue(true);

        const result = await contractService.delete("1");
        expect(result).toBe(true);
        expect(mockContractRepository.delete).toHaveBeenCalledWith("1");
    });

    it("Agregar equipo a un contrato", async () => {
        const validContractId = "507f1f77bcf86cd799439011";
        const mockContract = {
            _id: validContractId,
            customerId: "123",
            contractNumber: "C-001",
            startDate: new Date(),
            endDate: new Date(),
            monthlyCost: 100,
            active: true,
            equipments: [{ _id: "equip-1", name: "Laptop" }]
        };

        // Mock para la cadena findByIdAndUpdate().populate()
        const mockPopulate = jest.fn().mockResolvedValue(mockContract);
        ContractModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            populate: mockPopulate
        });

        const result = await contractService.addEquipment(validContractId, "equip-1");

        expect(result).toEqual(mockContract);
        expect(ContractModel.findByIdAndUpdate).toHaveBeenCalledWith(
            validContractId,
            { $addToSet: { equipments: "equip-1" } },
            { new: true }
        );
        expect(mockPopulate).toHaveBeenCalledWith("equipments");
    });

});

describe("Contract Service Negative Tests", () => {
    let contractService: ContractService;

    beforeEach(() => {
        contractService = new ContractService(mockContractRepository);
        jest.clearAllMocks();
    });

    it("Fallar al crear contrato con datos inválidos", async () => {
        const invalidContractData = {
            customerId: "",
            contractNumber: "",
            startDate: "not-a-date", 
            monthlyCost: -100 
        };

        mockContractRepository.create.mockRejectedValue(new Error("Datos de contrato inválidos"));

        await expect(contractService.create(invalidContractData as any))
            .rejects
            .toThrow("Datos de contrato inválidos");
    });

    it("Fallar al buscar contrato con ID inexistente", async () => {
        mockContractRepository.findById.mockResolvedValue(null);

        const result = await contractService.findById("non-existent-id");
        expect(result).toBeNull();
    });

    it("Fallar al actualizar contrato con datos inválidos", async () => {
        const invalidUpdate = {
            monthlyCost: -50,
            endDate: "invalid-date"
        };

        mockContractRepository.update.mockRejectedValue(new Error("Datos de actualización inválidos"));

        await expect(contractService.update("1", invalidUpdate as any))
            .rejects
            .toThrow("Datos de actualización inválidos");
    });

    it("Fallar al agregar equipo con ID de contrato inválido", async () => {
        const invalidContractId = "invalid-id";
        await expect(contractService.addEquipment(invalidContractId, "equip-1"))
            .rejects
            .toThrow("Invalid contract ID");
    });

    it("Fallar al agregar equipo a contrato inexistente", async () => {
        const nonExistentId = "507f1f77bcf86cd799439011";
        
        const mockPopulate = jest.fn().mockResolvedValue(null);
        ContractModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            populate: mockPopulate
        });

        const result = await contractService.addEquipment(nonExistentId, "equip-1");
        expect(result).toBeNull();        
        expect(mockPopulate).toHaveBeenCalledWith("equipments");
    });
});
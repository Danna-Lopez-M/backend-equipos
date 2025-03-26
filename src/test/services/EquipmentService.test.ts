import { EquipmentService } from '../../services/equipmentService';
import { Equipment, IEquipmentRepository } from "../../types/EquipmentTypes";
import { EquipmentModel } from "../../models/Equipment";


const mockEquipmentRepository: jest.Mocked<IEquipmentRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("Equipment Service Test", () => {
    let equipmentService: EquipmentService;

    beforeEach(() => {
        equipmentService = new EquipmentService(mockEquipmentRepository);
        jest.clearAllMocks();
    });

    it("Crear un equipo", async () => {
        const equipmentData: Equipment = {
            name: "Laptop",
            type: "Electronics",
            brand: "Dell",
            model: "XPS 15",
            description: "High performance laptop",
            price: 1500,
            stock: 10,
            warrantyPeriod: "2 years",
            releaseDate: new Date(),
            specifications: { processor: "Intel i7", ram: "16GB" }
        };
        mockEquipmentRepository.create.mockResolvedValue(equipmentData);

        const modelInstance = new EquipmentModel(equipmentData);
        expect(modelInstance.validateSync()).toBeUndefined();

        const result = await equipmentService.create(equipmentData);
        expect(result).toEqual(equipmentData);
        expect(mockEquipmentRepository.create).toHaveBeenCalledWith(equipmentData);
    });

    it("Encontrar equipos", async () => {
        const equipments: Equipment[] = [
            {
                name: "Laptop",
                type: "Electronics",
                brand: "Dell",
                model: "XPS 15",
                description: "High performance laptop",
                price: 1500,
                stock: 10,
                warrantyPeriod: "2 years",
                releaseDate: new Date(),
                specifications: { processor: "Intel i7", ram: "16GB" }
            }
        ];
        mockEquipmentRepository.find.mockResolvedValue(equipments);

        const result = await equipmentService.find();
        expect(result).toEqual(equipments);
        expect(mockEquipmentRepository.find).toHaveBeenCalled();
    });

    it("Encontrar equipo por ID", async () => {
        const equipment: Equipment = {
            name: "Laptop",
            type: "Electronics",
            brand: "Dell",
            model: "XPS 15",
            description: "High performance laptop",
            price: 1500,
            stock: 10,
            warrantyPeriod: "2 years",
            releaseDate: new Date(),
            specifications: { processor: "Intel i7", ram: "16GB" }
        };
        mockEquipmentRepository.findById.mockResolvedValue(equipment);

        const result = await equipmentService.findById("1");
        expect(result).toEqual(equipment);
        expect(mockEquipmentRepository.findById).toHaveBeenCalledWith("1");
    });

    it("Actualizar equipo", async () => {
        const updatedEquipment: Equipment = {
            name: "Laptop",
            type: "Electronics",
            brand: "Dell",
            model: "XPS 15",
            description: "High performance laptop",
            price: 1600, // Actualización del precio
            stock: 10,
            warrantyPeriod: "2 years",
            releaseDate: new Date(),
            specifications: { processor: "Intel i7", ram: "16GB" }
        };
        mockEquipmentRepository.update.mockResolvedValue(updatedEquipment);

        const result = await equipmentService.update("1", { price: 1600 });
        expect(result).toEqual(updatedEquipment);
        expect(mockEquipmentRepository.update).toHaveBeenCalledWith("1", { price: 1600 });
    });

    it("Eliminar equipo", async () => {
        mockEquipmentRepository.delete.mockResolvedValue(true);

        const result = await equipmentService.delete("1");
        expect(result).toBe(true);
        expect(mockEquipmentRepository.delete).toHaveBeenCalledWith("1");
    });
});

describe("Equipment Service Negative Tests", () => {
    let equipmentService: EquipmentService;

    beforeEach(() => {
        equipmentService = new EquipmentService(mockEquipmentRepository);
        jest.clearAllMocks();
    });

    it("Fallar al crear equipo con datos inválidos", async () => {
        const invalidEquipmentData = {
            name: "",
            price: -100,
            stock: -5
        };
        
        const modelInstance = new EquipmentModel(invalidEquipmentData as any);
        const validationError = modelInstance.validateSync();
        expect(validationError).toBeDefined();
        expect(validationError?.errors.name).toBeDefined();

        mockEquipmentRepository.create.mockRejectedValue(new Error("Datos de equipo inválidos"));

        await expect(equipmentService.create(invalidEquipmentData as any))
            .rejects
            .toThrow("Datos de equipo inválidos");
    });

    it("Fallar al buscar equipo con ID inexistente", async () => {
        mockEquipmentRepository.findById.mockResolvedValue(null);

        const result = await equipmentService.findById("non-existent-id");
        expect(result).toBeNull();
    });

    it("Fallar al actualizar equipo con datos inválidos", async () => {
        const invalidUpdate = {
            price: -50,
            stock: -10
        };

        mockEquipmentRepository.update.mockRejectedValue(new Error("Datos de actualización inválidos"));

        await expect(equipmentService.update("1", invalidUpdate as any))
            .rejects
            .toThrow("Datos de actualización inválidos");
    });

    it("Fallar al eliminar equipo inexistente", async () => {
        mockEquipmentRepository.delete.mockResolvedValue(false);

        const result = await equipmentService.delete("non-existent-id");
        expect(result).toBe(false);
    });
});

describe("Equipment Model", () => {
  it("debería validar un equipo correcto", () => {
    const equipment = new EquipmentModel({
      name: "Laptop",
      type: "Electronics",
      brand: "Dell",
      model: "XPS 15",
      description: "High performance laptop",
      price: 1500,
      stock: 10,
      warrantyPeriod: "2 years",
      releaseDate: new Date(),
      specifications: { processor: "Intel i7", ram: "16GB" }
    });
    expect(equipment.validateSync()).toBeUndefined();
  });
});
import ContractController from '../../controllers/ContractController';
import { ContractService } from '../../services/contractService';
import { Request, Response } from 'express';
import { Contract } from '../../types/ContractTypes';

describe('Contract Controller Tests', () => {
  let mockContractService: jest.Mocked<ContractService>;
  let contractController: ContractController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockContractService = {
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addEquipment: jest.fn()
    } as any;

    contractController = new ContractController(mockContractService);

    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  it('Obtener todos los contratos', async () => {
    const mockContracts: Contract[] = [{
      customerId: 'customer1',
      contractNumber: 'CN-001',
      startDate: new Date(),
      endDate: new Date(),
      monthlyCost: 1000,
      active: true,
      equipments: []
    } as unknown as Contract];
    mockContractService.find.mockResolvedValue(mockContracts);

    await contractController.getContracts(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(mockContracts);
  });

  it('Crear un nuevo contrato', async () => {
    const newContract: Contract = {
      customerId: 'customer1',
      contractNumber: 'CN-002',
      startDate: new Date(),
      endDate: new Date(),
      monthlyCost: 1500,
      active: true,
      equipments: []
    } as unknown as Contract;
    mockReq.body = newContract;
    mockContractService.create.mockResolvedValue(newContract);

    await contractController.createContract(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(newContract);
  });

//   it('Agregar equipo a un contrato', async () => {
//     mockReq.params = { id: '123' };
//     mockReq.body = { equipmentId: '456' };
    
//     const updatedContract: Contract = {
//       customerId: 'customer1',
//       contractNumber: 'CN-003',
//       startDate: new Date(),
//       endDate: new Date(),
//       monthlyCost: 1200,
//       active: true,
//       equipments: [{ id: '456' } as any] // Assuming Equipment type requires at least an id
//     } as unknown as Contract;
//     mockContractService.addEquipment.mockResolvedValue(updatedContract);

//     await contractController.addEquipmentToContract(mockReq as Request, mockRes as Response);

//     expect(mockRes.json).toHaveBeenCalledWith(updatedContract);
//   });

  it('Manejar error al agregar equipo a contrato no existente', async () => {
    mockReq.params = { id: '123' };
    mockReq.body = { equipmentId: '456' };
    
    mockContractService.addEquipment.mockResolvedValue(null);

    await contractController.addEquipmentToContract(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Contrato no encontrado" });
  });
});
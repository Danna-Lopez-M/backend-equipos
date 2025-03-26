import EquipmentController from '../../controllers/EquipmentController';
import { EquipmentService } from '../../services/equipmentService';
import { Request, Response } from 'express';
import { Equipment } from '../../types/EquipmentTypes';

describe('Equipment Controller Tests', () => {
  let mockEquipmentService: jest.Mocked<EquipmentService>;
  let equipmentController: EquipmentController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockEquipmentService = {
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    equipmentController = new EquipmentController(mockEquipmentService);

    mockReq = {};
    mockRes = {
      json: jest.fn()
    };
  });

  it('Obtener todos los equipos', async () => {
    const mockEquipments = [{
      _id: '1',
      type: 'PC',
      brand: 'Lenovo',
      model: 'CAT-100',
      description: 'Laptop de trabajo',
      serialNumber: 'SN-12345',
      status: 'Activo',
      acquisitionDate: new Date(),
      lastMaintenanceDate: new Date(),
      technicalSpecifications: {},
      toObject: () => ({
        type: 'PC',
        brand: 'Lenovo',
        model: 'CAT-100',
        description: 'Laptop de trabajo',
        serialNumber: 'SN-12345',
        status: 'Activo',
        acquisitionDate: new Date(),
        lastMaintenanceDate: new Date(),
        technicalSpecifications: {}
      })
    }] as unknown as (Equipment)[];

    mockEquipmentService.find.mockResolvedValue(mockEquipments);
    await equipmentController.getEquipments(mockReq as Request, mockRes as Response);
    expect(mockRes.json).toHaveBeenCalledWith(mockEquipments);
  });

  it('Crear un nuevo equipo', async () => {
    const newEquipment: Equipment = {
      name: 'Impresora Laser',
      type: 'Impresora',
      brand: 'DeWalt',
      model: 'DW-500',
      description: 'Impresora de alta velocidad',
      price: 15000,
      stock: 5,
      warrantyPeriod: '12 meses',
      releaseDate: new Date(),
      specifications: {
        velocidad: '0-2800 RPM',
        resolucion: '1200 DPI',
        calidad: 'Alta'
      }
    };

    mockReq.body = newEquipment;
    mockEquipmentService.create.mockResolvedValue(newEquipment);

    await equipmentController.createEquipment(mockReq as Request, mockRes as Response);
    expect(mockRes.json).toHaveBeenCalledWith(newEquipment);
  });

  it('Obtener equipo por ID', async () => {
    const equipment: Equipment = {
      name: 'Samsung Galaxy S21',
      type: 'Celular',
      brand: 'Samsung',
      model: 'S21',
      description: 'Celular de gama alta',
      price: 350000,
      stock: 1,
      warrantyPeriod: '12 meses',
      releaseDate: new Date(),
      specifications: {
        memoria: '256GB',
        ram: '8GB',
      }
    };

    mockReq.params = { id: '123' };
    mockEquipmentService.findById.mockResolvedValue(equipment);

    await equipmentController.getEquipmentById(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(equipment);
  });
});
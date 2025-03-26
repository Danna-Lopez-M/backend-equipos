import RoleController from '../../controllers/RoleController';
import { IRoleService, Role } from '../../types/RolesTypes';
import { Request, Response } from 'express';

describe('Role Controller Tests', () => {
  let mockRoleService: jest.Mocked<IRoleService>;
  let roleController: RoleController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRoleService = {
      find: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<IRoleService>;

    roleController = new RoleController(mockRoleService);

    mockReq = {
      body: {},
      params: {},
      currentUser: undefined
    };

    mockRes = {
      json: jest.fn()
    };
  });

  it('Obtener todos los roles', async () => {
    const mockRoles: Role[] = [
      {
        _id: '1',
        name: 'Admin',
        permissions: ['read', 'write'],
      } as Role
    ];

    mockRoleService.find.mockResolvedValue(mockRoles);
    await roleController.getRoles(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(mockRoles);
  });

  it('Crear un nuevo rol', async () => {
    const newRole: Role = {
      name: 'Nuevo Rol',
      permissions: ['read'],
    } as Role;

    mockReq.body = newRole;
    mockRoleService.create.mockResolvedValue(newRole);
    await roleController.createRole(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(newRole);
  });

  it('Obtener rol por ID', async () => {
    const role: Role = {
      _id: '123',
      name: 'Rol Test',
      permissions: ['read'],
    } as Role;

    mockReq.params = { id: '123' };
    mockRoleService.findById.mockResolvedValue(role);
    await roleController.getRoleById(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(role);
  });

  it('Actualizar un rol', async () => {
    const updatedRole: Role = {
      _id: '123',
      name: 'Rol Actualizado',
      permissions: ['read', 'write']
    } as Role;

    mockReq.params = { id: '123' };
    mockReq.body = { name: 'Rol Actualizado' };
    mockRoleService.update.mockResolvedValue(updatedRole);
    await roleController.updateRole(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(updatedRole);
  });

  it('Eliminar un rol', async () => {
    mockReq.params = { id: '123' };
    mockRoleService.delete.mockResolvedValue(true);
    await roleController.deleteRole(mockReq as Request, mockRes as Response);

    expect(mockRes.json).toHaveBeenCalledWith(true);
  });
});
import UserController from '../../controllers/UserController';
import { IUserService, User } from '../../types/UserTypes';
import { Request, Response } from 'express';
import { ValidationError, validationResult, Result } from 'express-validator';

type MockValidationResult = {
  isEmpty: () => boolean;
  array: () => ValidationError[];
} & Result<ValidationError>;

// Mock express-validator
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn().mockImplementation(() => ({
    isEmpty: () => true,
    array: () => [],
    formatWith: jest.fn(),
    throw: jest.fn()
  }))
}));


describe('User Controller Tests', () => {
    let mockUserService: jest.Mocked<IUserService>;
    let userController: UserController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        mockUserService = {
        find: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
        } as jest.Mocked<IUserService>;

        userController = new UserController(mockUserService);

        mockReq = {
        body: {},
        params: {}
        };

        mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
        };
    });

    it('Obtener todos los usuarios', async () => {
        const mockUsers: User[] = [
        {
            _id: '1',
            name: 'Usuario 1',
            email: 'user1@example.com',
            password: 'password1',
            comparePassword: jest.fn()
        } as unknown as User
        ];

        mockUserService.find.mockResolvedValue(mockUsers);

        await userController.getUsers(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('Crear un nuevo usuario', async () => {
        const newUser: User = {
        name: 'Nuevo Usuario',
        email: 'test@example.com',
        password: '123456',
        comparePassword: jest.fn()
        } as unknown as User;

        mockReq.body = newUser;
        mockUserService.create.mockResolvedValue(newUser);

        await userController.createUser(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newUser);
    });

    it('Manejar errores de validación al crear usuario', async () => {
        (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Error de validación', type: 'field' } as ValidationError]
        });

        mockReq.body = { name: '' };

        await userController.createUser(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ 
        errors: [{ msg: 'Error de validación', type: 'field' }] 
        });
    });

//   it('Obtener usuario por ID válido', async () => {
//     const user: User = {
//       _id: '123',
//       name: 'Usuario Test',
//       email: 'test@example.com',
//       password: 'password',
//       comparePassword: jest.fn()
//     } as unknown as User;

//     mockReq.params = { id: '123' };
//     mockUserService.findById.mockResolvedValue(user);

//     await userController.getUserById(mockReq as Request, mockRes as Response);

//     expect(mockRes.status).toHaveBeenCalledWith(200);
//     expect(mockRes.json).toHaveBeenCalledWith(user);
//   });

  it('Obtener usuario por ID válido', async () => {
    const user: User = {
      _id: '123',
      name: 'Usuario Test',
      email: 'test@example.com',
      password: 'password',
      comparePassword: jest.fn()
    } as unknown as User;

    mockReq.params = { id: '123' };
    mockUserService.findById.mockResolvedValue(user);

    console.log("REQ PARAMS ID:", mockReq.params.id);
    console.log("MOCK USER:", user);

    await userController.getUserById(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(user);
    });


  it('Actualizar usuario', async () => {
    const updatedUser: User = {
      _id: '123',
      name: 'Usuario Actualizado',
      email: 'updated@example.com',
      password: 'newpassword',
      comparePassword: jest.fn()
    } as unknown as User;

    mockReq.params = { id: '123' };
    mockReq.body = { name: 'Usuario Actualizado' };
    mockUserService.update.mockResolvedValue(updatedUser);

    await userController.updateUser(mockReq as Request, mockRes as Response);

    expect(mockUserService.update).toHaveBeenCalledWith('123', { name: 'Usuario Actualizado' });//
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
  });

  it('Eliminar usuario', async () => {
    mockReq.params = { id: '123' };
    mockUserService.delete.mockResolvedValue(true);

    await userController.deleteUser(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Usuario eliminado con éxito" });
  });

});
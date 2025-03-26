import { UserModel } from "../../models/Users";
import { UserService } from "../../services/userService";
import { IUserRepository, User } from "types/UserTypes";
import bcrypt from "bcrypt";

const mockUserRepository: IUserRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("User Service Test", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(mockUserRepository);
        jest.clearAllMocks();
    });

    const mockUser: User = {
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
    } as User;

    it("Crear usuario", async () => {
        const userInstance = new UserModel(mockUser);
        expect(userInstance.validateSync()).toBeUndefined();
        
        (mockUserRepository.create as jest.Mock).mockResolvedValue(mockUser);
        const result = await userService.create(mockUser);
        expect(result.email).toBe(mockUser.email);
    });

    it("Obtener lista de usuarios", async () => {
        (mockUserRepository.find as jest.Mock).mockResolvedValue([mockUser]);
        const result = await userService.find();
        expect(result).toEqual([mockUser]);
    });

    it("Obtener usuario por ID", async () => {
        (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
        const result = await userService.findById("1");
        expect(result).toEqual(mockUser);
    });

    it("Obtener usuario por email", async () => {
        (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
        const result = await userService.findByEmail("test@example.com");
        expect(result).toEqual(mockUser);
    });

    it("Actualizar usuario", async () => {
        (mockUserRepository.update as jest.Mock).mockResolvedValue(mockUser);
        const result = await userService.update("1", { name: "Updated User" });
        expect(result).toEqual(mockUser);
    });

    it("Eliminar usuario", async () => {
        (mockUserRepository.delete as jest.Mock).mockResolvedValue(true);
        const result = await userService.delete("1");
        expect(result).toBe(true);
    });

    it("Comparar contraseñas correctamente", async () => {
        const userData = {
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword"
        };

        jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

        const userInstance = new UserModel(userData);
        const result = await userInstance.comparePassword("plainpassword");
        
        expect(result).toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith(
            "plainpassword",
            "hashedpassword"
        );
    });

    it("Eliminar la contraseña en json", () => {
        const userData = {
            name: "Test User",
            email: "test@example.com",
            password: "secret"
        };

        const userInstance = new UserModel(userData);
        const userJson = userInstance.toJSON();
        
        expect(userJson.password).toBeUndefined();
        expect(userJson.name).toBe("Test User");
    });
});

describe("User Service Negative Tests", () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(mockUserRepository);
        jest.clearAllMocks();
    });

    it("Fallar al crear usuario sin campos requeridos", async () => {
        const invalidUser = {
            email: "test@example.com"
        };

        const userInstance = new UserModel(invalidUser);
        const validationError = userInstance.validateSync();
        expect(validationError?.errors.name).toBeDefined();
        expect(validationError?.errors.password).toBeDefined();

        (mockUserRepository.create as jest.Mock).mockRejectedValue(
            new Error("Datos incompletos")
        );

        await expect(userService.create(invalidUser as any))
            .rejects
            .toThrow("Datos incompletos");
    });

    it("Fallar al crear usuario con contraseña corta", async () => {
        const invalidUserData = {
            name: "Test User",
            email: "test@example.com",
            password: "123"
        };

        (mockUserRepository.create as jest.Mock).mockRejectedValue(new Error("La contraseña debe tener al menos 6 caracteres"));

        await expect(userService.create(invalidUserData as any))
            .rejects
            .toThrow("La contraseña debe tener al menos 6 caracteres");
    });

    it("Fallar al buscar usuario con ID inexistente", async () => {
        (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);

        const result = await userService.findById("non-existent-id");
        expect(result).toBeNull();
    });

    it("Fallar al buscar usuario por email inexistente", async () => {
        (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

        const result = await userService.findByEmail("nonexistent@example.com");
        expect(result).toBeNull();
    });

    it("Fallar al actualizar usuario con email inválido", async () => {
        const invalidUpdate = {
            email: "not-an-email"
        };

        (mockUserRepository.update as jest.Mock).mockRejectedValue(new Error("Email inválido"));

        await expect(userService.update("1", invalidUpdate as any))
            .rejects
            .toThrow("Email inválido");
    });

    it("Fallar al eliminar usuario inexistente", async () => {
        (mockUserRepository.delete as jest.Mock).mockResolvedValue(false);

        const result = await userService.delete("non-existent-id");
        expect(result).toBe(false);
    });
});

import mongoose from 'mongoose';
describe('User Hash Password Validations', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Encriptar password al guardar un nuevo usuario', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'plainpassword'
    };

    const user = new UserModel(userData);
    await user.save();

    expect(user.password).not.toBe('plainpassword');
    expect(user.password).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
  });

  it('No encriptar la password de nuevo si no se modifica', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john2@example.com',
      password: 'plainpassword'
    };

    const user = new UserModel(userData);
    await user.save();
    const originalHashedPassword = user.password;

    user.name = 'John Updated';
    await user.save();
    expect(user.password).toBe(originalHashedPassword);
  });

  it('Manejar errores de generación de hash de password', async () => {
    const originalGenSalt = bcrypt.genSalt;
    bcrypt.genSalt = jest.fn().mockRejectedValue(new Error('Salt generation failed'));
    
    const userData = {
      name: 'Error User',
      email: 'error@example.com',
      password: 'testpassword'
    };

    const user = new UserModel(userData);
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await user.save();
      expect(consoleErrorSpy).toHaveBeenCalled();
    } catch (error) {
      fail('Should not throw an error');
    } finally {
      bcrypt.genSalt = originalGenSalt;
      consoleErrorSpy.mockRestore();
    }
  });
});
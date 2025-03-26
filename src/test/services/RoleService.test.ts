import { RoleService } from "../../services/roleService";
import { IRoleRepository } from "../../types/RolesTypes";
import { Role } from "types/RolesTypes";

const mockRoleRepository: jest.Mocked<IRoleRepository> = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("Role Service Test", () => {
    let roleService: RoleService;

    beforeEach(() => {
        roleService = new RoleService(mockRoleRepository);
        jest.clearAllMocks();
    });

    it("Crear un rol", async () => {
        const roleData: Role = {
            _id: "1",
            name: "Admin",
        } as Role;
        mockRoleRepository.create.mockResolvedValue(roleData);

        const result = await roleService.create(roleData);
        expect(result).toEqual(roleData);
        expect(mockRoleRepository.create).toHaveBeenCalledWith(roleData);
    });

    it("Encontrar roles", async () => {
        const roles: Role[] = [
            { _id: "1", name: "Admin" } as Role,
        ];
        mockRoleRepository.find.mockResolvedValue(roles);

        const result = await roleService.find();
        expect(result).toEqual(roles);
        expect(mockRoleRepository.find).toHaveBeenCalled();
    });

    it("Encontrar rol por ID", async () => {
        const role: Role = { _id: "1", name: "Admin" } as Role;
        mockRoleRepository.findById.mockResolvedValue(role);

        const result = await roleService.findById("1");
        expect(result).toEqual(role);
        expect(mockRoleRepository.findById).toHaveBeenCalledWith("1");
    });

    it("Actualizar rol", async () => {
        const updatedRole: Role = { _id: "1", name: "SuperAdmin" } as Role;
        mockRoleRepository.update.mockResolvedValue(updatedRole);

        const result = await roleService.update("1", { name: "SuperAdmin" });
        expect(result).toEqual(updatedRole);
        expect(mockRoleRepository.update).toHaveBeenCalledWith("1", { name: "SuperAdmin" });
    });

    it("Eliminar rol", async () => {
        mockRoleRepository.delete.mockResolvedValue(true);

        const result = await roleService.delete("1");
        expect(result).toBe(true);
        expect(mockRoleRepository.delete).toHaveBeenCalledWith("1");
    });
});

describe("Role Service Negative Tests", () => {
    let roleService: RoleService;

    beforeEach(() => {
        roleService = new RoleService(mockRoleRepository);
        jest.clearAllMocks();
    });

    it("Fallar al crear rol con nombre vacío", async () => {
        const invalidRoleData = {
            name: ""
        };

        mockRoleRepository.create.mockRejectedValue(new Error("Nombre de rol no puede estar vacío"));

        await expect(roleService.create(invalidRoleData as any))
            .rejects
            .toThrow("Nombre de rol no puede estar vacío");
    });

    it("Fallar al buscar rol con ID inexistente", async () => {
        mockRoleRepository.findById.mockResolvedValue(null);

        const result = await roleService.findById("non-existent-id");
        expect(result).toBeNull();
    });

    it("Fallar al actualizar rol con nombre vacío", async () => {
        const invalidUpdate = {
            name: "" 
        };

        mockRoleRepository.update.mockRejectedValue(new Error("Nombre de rol no puede estar vacío"));

        await expect(roleService.update("1", invalidUpdate as any))
            .rejects
            .toThrow("Nombre de rol no puede estar vacío");
    });

    it("Fallar al eliminar rol inexistente", async () => {
        mockRoleRepository.delete.mockResolvedValue(false);

        const result = await roleService.delete("non-existent-id");
        expect(result).toBe(false);
    });
});
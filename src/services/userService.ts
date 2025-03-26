import { Query } from "types/RepositoryTypes";
import { IUserService, IUserRepository, User} from "types/UserTypes";

export class UserService implements IUserService {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async create(data: User): Promise<User> {
        return this.userRepository.create(data);
    }

    async find(query?: Query): Promise<User[]> {
        return this.userRepository.find(query);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return this.userRepository.delete(id);
    } 
}
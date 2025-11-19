import { DataSource } from "typeorm";
import { Booking, User } from "../models/models.js";
import databaseConfig from "../config/databaseConfig.js";
import { IStorageRepo, IUser } from "../interfaces/interfaces.js";

const db = databaseConfig.databaseConfig;

export class PostgresStorageRepo implements IStorageRepo {
  private readonly dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: db.db_host,
      port: 5433,
      username: "postgres",
      password: "postgres",
      database: "bliss",
      entities: [User, Booking],
        synchronize: true,   

    });
  }

  async init() {
    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized) {
      throw new Error("Datastore not initialized");
    }
  }

  async destroy() {
    await this.dataSource.destroy();
  }

  async storeUser(user: IUser): Promise<IUser> {
    const userRepo = this.dataSource.getRepository<IUser>(User);
    return await userRepo.save(user);
  }

  async updateUser(user: IUser): Promise<IUser> {
    const userRepo = this.dataSource.getRepository(User);
    if (!user.id) {
      throw new Error("ID is required");
    }

    const existingUser = await userRepo.findOne({ where: { id: user.id } });
    if (!existingUser) {
      throw new Error(`User with id ${user.id} not found`);
    }

    const updatedUser = userRepo.merge(existingUser, user);

    return await userRepo.save(updatedUser);
  }

  async getAllUsers(): Promise<IUser[]> {
    const UserRepo = this.dataSource.getRepository<IUser>(User);
    return await UserRepo.find({
      order: { createdAt: "desc" },
    });
  }
}

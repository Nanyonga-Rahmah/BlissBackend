import { DataSource } from "typeorm";
import { Booking, Link, User } from "../models/models";
import databaseConfig from "../config/databaseConfig";
import { ILink, IStorageRepo, IUser } from "../interfaces/interfaces";
import { error } from "console";

const db = databaseConfig.databaseConfig;

export class PostgresStorageRepo implements IStorageRepo {
  private readonly dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: db.db_host,
      port: 5433,
      username: db.db_username,
      password: db.db_password,
      database: db.db_database,
      entities: [User, Booking,Link],
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

 async storeLink(link: ILink): Promise<ILink> {
  const linkRepo = this.dataSource.getRepository(Link);

  let existingLink = await linkRepo.findOne({
    where: { user_email: link.user_email },
  });

  if (existingLink) {
    existingLink.user_email = link.user_email;
    existingLink.expires_at = link.expires_at;
    existingLink.isClicked = false; 
    return await linkRepo.save(existingLink);
  }

  // If no existing link, create a new one
  const newLink = linkRepo.create(link);
  return await linkRepo.save(newLink);
}


  async getUserByEmail(user_email: string): Promise<IUser> {
    const userRepo = this.dataSource.getRepository<IUser>(User);
    const user = await userRepo.findOne({
      where: { email: user_email },
      // relations: ['role_name', 'clientID'],
    });
    // if (user?.role_name && typeof user.role_name === 'object') {
    //     user.role_name = (user.role_name as any).roleName;
    // }
    // if (user?.clientID && typeof user.clientID === 'object') {
    //     user.clientID = (user.clientID as any).clientID;
    // }
    if (!user) {
      throw error("User doesn't exist");
    }
    return user;
  }

  async getLinkByEmail(user_email: string): Promise<ILink> {
    const userRepo = this.dataSource.getRepository<ILink>(Link);
    const link = await userRepo.findOne({
      where: { user_email: user_email },
      // relations: ['role_name', 'clientID'],
    });

    if (!link) {
      throw error("Link doesn't exist");
    }
    return link;
  }

    async getLinkById(id: number): Promise<ILink> {
    const userRepo = this.dataSource.getRepository<ILink>(Link);
    const link = await userRepo.findOne({
      where: { id: id },
      // relations: ['role_name', 'clientID'],
    });

    if (!link) {
      throw error("Link doesn't exist");
    }
    return link;
  }

  async updateLink(id: number, updates: Partial<ILink>): Promise<ILink> {
    const linkRepo = this.dataSource.getRepository(Link);

    const link = await linkRepo.findOneBy({ id: id });

    if (!link) {
      throw error("Link doesn't exist");
    }

    Object.assign(link, updates);

    return await linkRepo.save(link);
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

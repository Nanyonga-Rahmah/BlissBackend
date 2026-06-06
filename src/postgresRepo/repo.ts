import { DataSource, ILike } from "typeorm";
import {
  AvailableDay,
  Booking,
  City,
  Link,
  User,
  Service,
  Variant,
  Payment,
} from "../models/models";
import databaseConfig from "../config/databaseConfig";
import {
  IAvailableDay,
  IBooking,
  ICity,
  ILink,
  IPayment,
  IService,
  IStorageRepo,
  IUser,
  IVariant,
} from "../interfaces/interfaces";
import { error } from "console";

const db = databaseConfig.databaseConfig;

export class PostgresStorageRepo implements IStorageRepo {
  public dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: db.db_host,
      port: 5433,
      username: db.db_username,
      password: db.db_password,
      database: db.db_database,
      entities: [User, Booking, Link, City, AvailableDay, Service, Variant,Payment],
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

  async storePayment(payment: IPayment): Promise<IPayment> {
    const paymentRepo = this.dataSource.getRepository<IPayment>(Payment);
    return await paymentRepo.save(payment);
  }

  async stroreCity(city: ICity): Promise<ICity> {
    const cityRepo = this.dataSource.getRepository<ICity>(City);
    return await cityRepo.save(city);
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

    if (!user) {
      throw error("User doesn't exist");
    }
    return user;
  }

  async getUserById(id: number): Promise<IUser> {
    const userRepo = this.dataSource.getRepository<IUser>(User);
    const user = await userRepo.findOne({
      where: { id: id },
      // relations: ['role_name', 'clientID'],
    });

    if (!user) {
      throw error("User doesn't exist");
    }
    return user;
  }

  async getBookingById(id: number): Promise<IBooking> {
    const bookingRepo = this.dataSource.getRepository<IBooking>(Booking);
    const booking = await bookingRepo.findOne({
      where: { id: id },
    });
    if (!booking) {
      throw error("Booking doesn't exist");
    }
    return booking;
  }

  async getAllBookings(): Promise<IBooking[]> {
    const bookingRepo = this.dataSource.getRepository<IBooking>(Booking);
    return await bookingRepo.find({});
  }

  async getUserBookings(userId: number): Promise<IBooking[]> {
    const bookingRepo = this.dataSource.getRepository<IBooking>(Booking);
    return await bookingRepo.find({
      where: { userId: userId },
    });
  }

  async updateBooking(
    id: number,
    updates: Partial<IBooking>,
  ): Promise<IBooking> {
    const bookingRepo = this.dataSource.getRepository(Booking);

    const booking = await bookingRepo.findOneBy({ id: id });

    if (!booking) {
      throw error("Booking doesn't exist");
    }

    Object.assign(booking, updates);

    return await bookingRepo.save(booking);
  }

  async getAllCities(): Promise<ICity[]> {
    const cityRepo = this.dataSource.getRepository<ICity>(City);
    return await cityRepo.find({});
  }

  async getAllServices(): Promise<IService[]> {
    const serviceRepo = this.dataSource.getRepository<IService>(Service);
    return await serviceRepo.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getAllActiveServices(): Promise<IService[]> {
    const serviceRepo = this.dataSource.getRepository<IService>(Service);
    return await serviceRepo.find({
      where: { status: "active" },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async deleteService(id: number): Promise<void> {
    const serviceRepo = this.dataSource.getRepository<IService>(Service);

    await serviceRepo.delete(id);
  }

  async deleteVariant(id: number): Promise<void> {
    const variantRepo = this.dataSource.getRepository<IVariant>(Variant);

    await variantRepo.delete(id);
  }
  async getCityById(id: number): Promise<ICity> {
    const cityRepo = this.dataSource.getRepository<ICity>(City);
    const city = await cityRepo.findOne({
      where: { id: id },
    });

    if (!city) {
      throw error("City doesn't exist");
    }
    return city;
  }

  async getServiceById(id: number): Promise<IService> {
    const serviceRepo = this.dataSource.getRepository<IService>(Service);
    const service = await serviceRepo.findOne({
      where: { id: id },
      // relations:["variants"]
    });

    if (!service) {
      throw error("Service doesn't exist");
    }
    return service;
  }

  async getParticularService(): Promise<IService[]> {
    const serviceRepo = this.dataSource.getRepository<IService>(Service);
    const services = await serviceRepo.find({
      where: {
        name: ILike("%removal%"),
      },
    });

    if (!services) {
      throw error("Service doesn't exist");
    }
    return services;
  }

  async getVariantsByServiceId(serviceId: number): Promise<IVariant[]> {
    const variantRepo = this.dataSource.getRepository(Variant);

    const variants = await variantRepo
      .createQueryBuilder("variant")
      .where("variant.serviceId = :serviceId", { serviceId })
      .getMany();

    if (variants.length === 0) {
      throw new Error("No variants for this service");
    }

    return variants;
  }

  async updateCity(id: number, updates: Partial<ICity>): Promise<ICity> {
    const cityRepo = this.dataSource.getRepository(City);

    const city = await cityRepo.findOneBy({ id: id });

    if (!city) {
      throw error("City doesn't exist");
    }

    Object.assign(city, updates);

    return await cityRepo.save(city);
  }

  async updateService(
    id: number,
    updates: Partial<IService>,
  ): Promise<IService> {
    const serviceRepo = this.dataSource.getRepository(Service);

    const service = await serviceRepo.findOneBy({ id: id });

    if (!service) {
      throw error("Service doesn't exist");
    }

    Object.assign(service, updates);

    return await serviceRepo.save(service);
  }

  async updateVariant(
    id: number,
    updates: Partial<IVariant>,
  ): Promise<IVariant> {
    const variantRepo = this.dataSource.getRepository(Variant);

    const variant = await variantRepo.findOneBy({ id: id });

    if (!variant) {
      throw error("Variant doesn't exist");
    }

    Object.assign(variant, updates);

    return await variantRepo.save(variant);
  }

  async storeAvailableDay(day: IAvailableDay): Promise<IAvailableDay> {
    const availableRepo =
      this.dataSource.getRepository<IAvailableDay>(AvailableDay);

    return await availableRepo.save(day);
  }

  async storeService(service: IService): Promise<IService> {
    const serviceRepo = this.dataSource.getRepository<IService>(Service);

    return await serviceRepo.save(service);
  }

  async storeBooking(booking: IBooking): Promise<IBooking> {
    const bookingRepo = this.dataSource.getRepository<IBooking>(Booking);

    return await bookingRepo.save(booking);
  }

  async getDayByDate(day: string): Promise<IAvailableDay> {
    const availableDay = await this.dataSource
      .getRepository(AvailableDay)
      .createQueryBuilder("day")
      .where("DATE(day.day) = :day", { day: day })
      .getOne();

    if (!availableDay) {
      throw error("Available day doesn't exist");
    }
    return availableDay;
  }

  async updateAvailableDay(
    id: number,
    updates: Partial<IAvailableDay>,
  ): Promise<IAvailableDay> {
    const availableRepo = this.dataSource.getRepository(AvailableDay);

    const availableDay = await availableRepo.findOneBy({ id: id });

    if (!availableDay) {
      throw error("Available day doesn't exist");
    }

    Object.assign(availableDay, updates);

    return await availableRepo.save(availableDay);
  }

  async storeVariant(variant: IVariant): Promise<IVariant> {
    const variantRepo = this.dataSource.getRepository<IVariant>(Variant);

    return await variantRepo.save(variant);
  }

  async getDayById(id: number): Promise<IAvailableDay> {
    const availableRepo =
      this.dataSource.getRepository<IAvailableDay>(AvailableDay);
    const availableDay = await availableRepo.findOne({
      where: { id: id },
    });

    if (!availableDay) {
      throw error("Available day doesn't exist");
    }
    return availableDay;
  }
  async getAvailableDays(): Promise<IAvailableDay[]> {
    const availableRepo =
      this.dataSource.getRepository<IAvailableDay>(AvailableDay);

    return await availableRepo.find({});
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
  async updateUser(id: number, updates: Partial<IUser>): Promise<IUser> {
    const userRepo = this.dataSource.getRepository(User);

    const user = await userRepo.findOneBy({ id: id });

    if (!user) {
      throw error("User doesn't exist");
    }

    Object.assign(user, updates);

    return await userRepo.save(user);
  }

  async getAllUsers(): Promise<IUser[]> {
    const UserRepo = this.dataSource.getRepository<IUser>(User);
    return await UserRepo.find({
      order: { createdAt: "desc" },
      where: { userType: "user" },
    });
  }


  async getAllAdmins(): Promise<IUser[]> {
    const UserRepo = this.dataSource.getRepository<IUser>(User);
    return await UserRepo.find({
      order: { createdAt: "desc" },
      where: { userType: "admin" },
    });
  }
  async getAllPayments(): Promise<IPayment[]> {
    const paymentRepo = this.dataSource.getRepository<IPayment>(Payment);
    return await paymentRepo.find({
      order: { createdAt: "desc" },
    });
  }
}

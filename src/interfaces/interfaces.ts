import { Timestamp } from "typeorm";

export interface IUser {
  id?: number;
  lastName: string;
  firstName: string;
  password: string;
  email: string;
  bookings?: number[];
  isVerified?: boolean;
  createdAt: Date;
  userType: string;
}

export interface ILink {
  id?: number;

  user_email: string;

  isClicked: boolean;

  expires_at?: Date | undefined;
}

export interface IBooking {
  id?: number;
  serviceName: string;
  bookingDay: string;
  bookingTime: string;
  isCanceled: boolean;
  cancelationReason?: string;
  status: string;
  city: string;
  size?: string;
  length?: string;
  userId: number;
  amount: string;
  travelfee?: string;
  servicefee?: string;
  createdAt: Date;
}

export type TimeSlot = { start: string; end: string };

export interface IAvailableDay {
  id?: number;
  day: string;
  timeSlots: TimeSlot[];
  status: string;
  isBooked?: boolean;
}

export interface ICity {
  id?: number;
  name: string;
  travelFee: number;
  status: string;
  activeBookings: number;
}
export interface IVariant {
  id?: number;
  name: string;
  price: number;
  length?: string;
  status: string;
  serviceId: number;
}
export interface IService {
  id?: number;
  name: string;
  image: string;
  status: string;
  description: string;
  variants?: number[];
}

export type TLogMethod = (message: string | Error, meta?: unknown) => void;
export type TJson =
  | string
  | number
  | boolean
  | { [x: string]: TJson }
  | Array<TJson>
  | unknown;
export type TAuthenticationResponse = {
  isAuthenticated?: boolean;
  token: string;
  userData?: any;
};

export interface ILogger {
  error: TLogMethod;
  warn: TLogMethod;
  trace: TLogMethod;
  info: TLogMethod;
  verbose: TLogMethod;
  debug: TLogMethod;
  silly: TLogMethod;
  child(context?: TJson): ILogger;
}

export interface DecodedToken {
  id: number;
  username: string;
}

export interface IStorageRepo {
  init(): Promise<void>;
  destroy(): Promise<void>;

  storeUser(user: IUser): Promise<IUser>;
  storeAvailableDay(day: IAvailableDay): Promise<IAvailableDay>;
  getAvailableDays(): Promise<IAvailableDay[]>;
  getDayByDate(day: string): Promise<IAvailableDay>;
  updateAvailableDay(id: number, updates: Partial<IAvailableDay>): Promise<IAvailableDay>;
  getUserByEmail(user_email: string): Promise<IUser>;
  getUserById(id: number): Promise<IUser>;
  updateUser(id:number,updates:Partial<IUser>): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  storeLink(link: ILink): Promise<ILink>;
  getLinkByEmail(user_email: string): Promise<ILink>;
  getLinkById(id: number): Promise<ILink>;
  updateLink(id: number, updates: Partial<ILink>): Promise<ILink>;
  stroreCity(city: ICity): Promise<ICity>;
  storeService(service: IService): Promise<IService>;
  storeBooking(booking: IBooking): Promise<IBooking>;
  getBookingById(id: number): Promise<IBooking>;
  getAllBookings(): Promise<IBooking[]>;
  getUserBookings(userId: number): Promise<IBooking[]>;
  getDayById(id: number): Promise<IAvailableDay>;
  storeVariant(variant: IVariant): Promise<IVariant>;
  updateBooking(id: number, updates: Partial<IBooking>): Promise<IBooking>;
  getAllServices(): Promise<IService[]>;
  getServiceById(id: number): Promise<IService>;
  getVariantsByServiceId(serviceId: number): Promise<IVariant[]>;
  getAllCities(): Promise<ICity[]>;
  getCityById(id: number): Promise<ICity>;
  updateCity(id: number, updates: Partial<ICity>): Promise<ICity>;
  updateService(id: number, updates: Partial<IService>): Promise<IService>;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Timestamp,
  PrimaryColumn,
} from "typeorm";
import type {
  IAvailableDay,
  IBooking,
  ICity,
  ILink,
  IPayment,
  IService,
  IUser,
  IVariant,
  TimeSlot,
} from "../interfaces/interfaces.js";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text", { unique: true })
  email: string;

  @Column("text")
  userType: string;

  @Column("text")
  password: string;

  @Column()
  isVerified: boolean;

  @Column()
  createdAt: Date;

  @Column("simple-json", { nullable: true })
  bookings: number[];

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userType: string,
    bookings: number[],
    createdAt: Date,
    isVerified: boolean,
  ) {
    ((this.id = id),
      (this.firstName = firstName),
      (this.lastName = lastName),
      (this.email = email),
      (this.userType = userType),
      (this.bookings = bookings),
      (this.password = password),
      (this.isVerified = isVerified),
      (this.createdAt = createdAt));
  }
}
@Entity()
export class Booking implements IBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  bookingDay: string;

  @Column()
  bookingTime: string;

  @Column()
  isCanceled: boolean;

  @Column()
  city: string;

  @Column()
  size?: string;

  @Column()
  length?: string;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  userId: number;

  @Column()
  amount: string;

  @Column({ nullable: true })
  hasRemovalAddOn?: boolean;

  @Column({ nullable: true })
  removalDetailsLength?: string;

  @Column({ nullable: true })
  removalDetailsPrice?: number;

  @Column({ nullable: true })
  removalDetailsSize?: string;

  @Column({ nullable: true })
  cancelationReason?: string;

  @Column({ nullable: true })
  travelfee?: string;

  @Column({ nullable: true })
  serviceFee?: string;

  constructor(
    id: number,
    serviceName: string,
    bookingDay: string,
    bookingTime: string,
    isCanceled: boolean,
    status: string,
    size: string,
    userId: number,
    createdAt: Date,
    travelfee: string,
    servicefee: string,
    length: string,
    city: string,
    amount: string,

    hasRemovalAddOn: boolean,
    removalDetailsSize: string,
    removalDetailsLength: string,
    removalDetailsPrice: number,
  ) {
    ((this.id = id),
      (this.serviceName = serviceName),
      (this.bookingDay = bookingDay),
      (this.bookingTime = bookingTime),
      (this.amount = amount),
      (this.isCanceled = isCanceled),
      (this.city = city),
      (this.createdAt = createdAt),
      (this.userId = userId),
      (this.travelfee = travelfee),
      (this.serviceFee = servicefee),
      (this.hasRemovalAddOn = hasRemovalAddOn),
      (this.removalDetailsLength = removalDetailsLength),
      (this.removalDetailsPrice = removalDetailsPrice),
      (this.removalDetailsSize = removalDetailsSize),
      (this.size = size),
      (this.length = length),
      (this.status = status));
  }
}

@Entity()
export class Variant implements IVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  length?: string;

  @Column()
  price: number;

  @Column()
  status: string;

  @ManyToOne(() => Service, (service) => service.variants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "serviceId" })
  serviceId: number;

  constructor(
    name: string,
    price: number,
    status: string,
    length: string,
    id: number,
    serviceId: number,
  ) {
    ((this.id = id),
      (this.name = name),
      (this.length = length),
      (this.status = status),
      (this.price = price),
      (this.serviceId = serviceId));
  }
}

@Entity()
export class Service implements IService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image?: string;

  @Column("text", { array: true, nullable: true, default: [] })
  images: string[];

  @Column()
  description: string;

  @Column()
  status: string;

  @Column("simple-json", { nullable: true })
  variants: number[];

  @Column({ nullable: true })
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    image: string,
    images: string[],
    description: string,
    status: string,
    variants: number[],
    createdAt: Date,
  ) {
    ((this.id = id),
      (this.name = name),
      (this.image = image),
      (this.images = images),
      (this.description = description),
      (this.variants = variants),
      (this.createdAt = createdAt),
      (this.status = status));
  }
}

@Entity()
export class Payment implements IPayment {
  @PrimaryColumn()
  id?: string;

  @Column()
  customerName: string;

  @Column()
  city: string;

  @Column()
  status: string;

  @Column()
  paymentMethod: string;

  @Column()
  paymentIntentId: string;

  @Column()
  amount: number;

  @Column()
  createdAt: Date;

  constructor(
    id: string,
    customerName: string,
    city: string,
    createdAt: Date,
    paymentMethod: string,
    paymentIntentId: string,
    status: string,
    amount: number,
  ) {
    ((this.id = id),
      (this.customerName = customerName),
      (this.city = city),
      (this.createdAt = createdAt),
      (this.paymentIntentId = paymentIntentId),
      (this.status = status),
      (this.paymentMethod = paymentMethod));
    this.amount = amount;
  }
}

@Entity()
export class AvailableDay implements IAvailableDay {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "date", nullable: true }) day: string;

  @Column({ nullable: true })
  isBooked?: boolean;

  @Column({ type: "jsonb", default: () => "'[]'" })
  timeSlots: TimeSlot[];

  @Column()
  status: string;

  constructor(
    id: number,
    day: string,
    status: string,
    isBooked: boolean,
    timeSlots: TimeSlot[],
  ) {
    ((this.id = id),
      (this.day = day),
      (this.isBooked = isBooked),
      (this.status = status),
      (this.timeSlots = timeSlots));
  }
}

@Entity()
export class City implements ICity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("text")
  name: string;

  @Column("bigint")
  travelFee: number;

  @Column()
  activeBookings: number;

  @Column("text")
  status: string;

  constructor(
    id: number,
    name: string,
    status: string,
    activeBookings: number,
    travelFee: number,
  ) {
    ((this.id = id),
      (this.name = name),
      (this.travelFee = travelFee),
      (this.activeBookings = activeBookings),
      (this.status = status));
  }
}

@Entity()
export class Link implements ILink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  user_email: string;

  @Column({ nullable: true })
  isClicked: boolean;

  @Column("timestamp", { nullable: true })
  expires_at?: Date | undefined;

  constructor(
    id: number,
    user_email: string,

    isClicked: boolean,
    expires_at: Date,
  ) {
    this.id = id;
    this.user_email = user_email;

    this.expires_at = expires_at;
    this.isClicked = isClicked;
  }
}

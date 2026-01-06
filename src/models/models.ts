import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Timestamp,
} from "typeorm";
import type {
  IAvailableDay,
  IBooking,
  ICity,
  ILink,
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

  @OneToMany(() => Booking, (booking) => booking.id)
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
    isVerified: boolean
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
  name: string;

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

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  userId: number;

  @Column()
  bookingFee: string;

  constructor(
    id: number,
    name: string,
    bookingDay: string,
    bookingTime: string,
    isCanceled: boolean,
    status: string,
    size: string,
    userId: number,
    length: string,
    city: string,
    bookingFee: string
  ) {
    ((this.id = id),
      (this.name = name),
      (this.bookingDay = bookingDay),
      (this.bookingTime = bookingTime),
      (this.bookingFee = bookingFee),
      (this.isCanceled = isCanceled),
      (this.city = city),
      (this.userId = userId),
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
    serviceId: number
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

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @OneToMany(() => Variant, (variant) => variant.id, {
    onDelete: "CASCADE",
  })
  variants?: number[];

  constructor(
    id: number,
    name: string,
    image: string,
    description: string,
    status: string,
    variants: number[]
  ) {
    ((this.id = id),
      (this.name = name),
      (this.image = image),
      (this.description = description),
      (this.variants = variants),
      (this.status = status));
  }
}

@Entity()
export class AvailableDay implements IAvailableDay {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  day: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  timeSlots: TimeSlot[];

  @Column()
  status: string;

  constructor(id: number, day: string, status: string, timeSlots: TimeSlot[]) {
    ((this.id = id),
      (this.day = day),
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
    travelFee: number
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
    expires_at: Date
  ) {
    this.id = id;
    this.user_email = user_email;

    this.expires_at = expires_at;
    this.isClicked = isClicked;
  }
}

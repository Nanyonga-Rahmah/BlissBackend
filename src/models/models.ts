import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import type { IBooking, ILink, IUser } from "../interfaces/interfaces.js";

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
  password: string;

  @Column({ type: "int", array: true, nullable: true })
  bookingIds: number[];

  @Column()
  isVerified: boolean;

  @Column()
  createdAt: Date;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    bookingIds: number[],
    createdAt: Date,
    isVerified: boolean
  ) {
    (this.id = id),
      (this.firstName = firstName),
      (this.lastName = lastName),
      (this.email = email),
      (this.password = password),
      (this.bookingIds = bookingIds),
      (this.isVerified = isVerified),
      (this.createdAt = createdAt);
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
  status: string;

  @Column()
  bookingFee: string;

  constructor(
    id: number,
    name: string,
    bookingDay: string,
    bookingTime: string,
    isCanceled: boolean,
    status: string,
    bookingFee: string
  ) {
    (this.id = id),
      (this.name = name),
      (this.bookingDay = bookingDay),
      (this.bookingTime = bookingTime),
      (this.bookingFee = bookingFee),
      (this.isCanceled = isCanceled),
      (this.status = status);
  }
}

@Entity()
export class Link implements ILink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  user_email: string;

  @Column( { nullable: true })
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

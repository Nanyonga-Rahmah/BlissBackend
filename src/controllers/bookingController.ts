import {
  DecodedToken,
  IBooking,
  ICity,
  ILink,
  ILogger,
  IService,
  IStorageRepo,
  IUser,
  IVariant,
  TAuthenticationResponse,
} from "../interfaces/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import databaseConfig from "../config/databaseConfig";
import { render } from "@react-email/render";
import React from "react";
import VerifyEmail from "../views/user_verification";

import { Resend } from "resend";
import { error } from "console";
const secret = databaseConfig.secretStore;

const resend = new Resend(secret.resend_api);
const Resend_from = secret.from;

export class BookingController {
  constructor(
    private readonly storageRepo: IStorageRepo, // private readonly logger: ILogger
  ) {}

  async createBooking(booking: IBooking): Promise<IBooking> {
    try {
      const bookingToSave: IBooking = {
        serviceName: booking.serviceName,
        bookingDay: booking.bookingDay,
        bookingTime: booking.bookingTime,
        isCanceled: false,
        userId: booking.userId,
        length: booking?.length ?? "",
        city: booking.city,
        amount: booking.amount,
        createdAt: new Date(),
        status: "upcoming",
        travelfee: booking?.travelfee ?? "",
        servicefee: booking?.servicefee ?? "",
        size: booking?.size ?? "",
      };

      const createdBooking = await this.storageRepo.storeBooking(bookingToSave);

      if (!createdBooking) {
        throw Error("Booking not found");
      }

      const dayRecord = await this.storageRepo.getDayByDate(booking.bookingDay);
      if (dayRecord) {
        await this.storageRepo.updateAvailableDay(dayRecord.id ?? 0, {
          isBooked: true,
          status:"not available"
        });
      }

      await this.storageRepo.updateUser(booking.userId, {
        bookings: [createdBooking.id ?? 0],
      });

      return createdBooking;
    } catch (error) {
      throw error;
    }
  }

  async createVariant(variant: IVariant): Promise<IVariant> {
    try {
      const variantToCreate: IVariant = {
        name: variant.name,
        serviceId: variant.serviceId,
        price: variant.price,
        status: variant.status,
        length: variant?.length ?? "",
      };

      const createdVariant =
        await this.storageRepo.storeVariant(variantToCreate);

      // const retrievedService = await this.storageRepo.getServiceById(
      //   variant.serviceId
      // );

      await this.storageRepo.updateService(variant.serviceId, {
        variants: [createdVariant.id ?? 0],
      });

      if (!createdVariant) {
        throw Error("variant not found");
      }

      return createdVariant;
    } catch (error) {
      throw error;
    }
  }

  async getBookingById(id: number): Promise<IBooking> {
    try {
      const RetrievedBooking = this.storageRepo.getBookingById(id);

      if (!RetrievedBooking) {
        throw Error("No Booking Found");
      }

      return RetrievedBooking;
    } catch (error) {
      throw error;
    }
  }

  async getAllBookings(): Promise<IBooking[]> {
    try {
      const RetrievedBookings = this.storageRepo.getAllBookings();

      if (!RetrievedBookings) {
        throw Error("No Bookings Found");
      }

      return RetrievedBookings;
    } catch (error) {
      throw error;
    } 
      }

  

  async getUserBookings(userId: number): Promise<IBooking[]> {
    try {
      const RetrievedBookings = this.storageRepo.getUserBookings(userId);

      if (!RetrievedBookings) {
        throw Error("No Bookings Found");
      }

      return RetrievedBookings;
    } catch (error) {
      throw error;
    }
  }


  async CancelBooking(id: number, cancelationReason: string): Promise<IBooking> {
    try {
      const bookingToUpdate = await this.storageRepo.getBookingById(id);

      if (!bookingToUpdate) {
        throw Error("No Booking Found");
      }

      bookingToUpdate.isCanceled = true;
      bookingToUpdate.cancelationReason = cancelationReason;

      return await this.storageRepo.updateBooking(id, bookingToUpdate);
    } catch (error) {
      throw error;
    }
  }

  async getAllVariantsByServiceId(serviceId: number): Promise<IVariant[]> {
    try {
      const RetrievedVariants = this.storageRepo.getVariantsByServiceId(serviceId);

      if (!RetrievedVariants) {
        throw Error("No Variants Found");
      }

      return RetrievedVariants;
    } catch (error) {
      throw error;
    }
  }

  async updateCity(id: number, updates: Partial<ICity>) {
    return this.storageRepo.updateCity(id, updates);
  }
}

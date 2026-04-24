import {
  DecodedToken,
  IAvailableDay,
  ICity,
  ILink,
  ILogger,
  IStorageRepo,
  IUser,
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
import AvailabilityEmail from "../views/availability";
const secret = databaseConfig.secretStore;

const resend = new Resend(secret.resend_api);
const Resend_from = secret.from;

export class AvailabilityController {
  constructor(
    private readonly storageRepo: IStorageRepo // private readonly logger: ILogger
  ) {}

  async createAvailability(
  availableday: IAvailableDay
): Promise<IAvailableDay> {
  try {
    const dayToCreate: IAvailableDay = {
      day: availableday.day,
      status: "available",
      timeSlots: availableday.timeSlots,
    };

    const createdDay = await this.storageRepo.storeAvailableDay(dayToCreate);

    if (!createdDay) {
      throw new Error("Day not created");
    }

    const users = await this.storageRepo.getAllUsers();

    const from = Resend_from;
    const subject = "New Availability Created";

    await Promise.all(
      users.map(async (user) => {
        const html = await render(
          React.createElement(AvailabilityEmail, {
            name: user.firstName,
            day: createdDay.day,
            timeSlots: createdDay.timeSlots,
          })
        );

        return resend.emails.send({
          to: user.email,
          subject,
          html,
          from,
        });
      })
    );

    return createdDay;
  } catch (error) {
    throw error;
  }
}

  async getCityById(id: number): Promise<ICity> {
    try {
      const RetrievedCity = this.storageRepo.getCityById(id);

      if (!RetrievedCity) {
        throw Error("No City Found");
      }

      return RetrievedCity;
    } catch (error) {
      throw error;
    }
  }

  async getAllAvailableDays(): Promise<IAvailableDay[]> {
    try {
      const RetrievedDays = this.storageRepo.getAvailableDays();

      if (!RetrievedDays) {
        throw Error("No available days Found");
      }

      return RetrievedDays;
    } catch (error) {
      throw error;
    }
  }

  async updateCity(id: number, updates: Partial<ICity>) {
    return this.storageRepo.updateCity(id, updates);
  }
}

import {
  DecodedToken,
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
const secret = databaseConfig.secretStore;

const resend = new Resend(secret.resend_api);
const Resend_from = secret.from;

export class CityController {
  constructor(
    private readonly storageRepo: IStorageRepo // private readonly logger: ILogger
  ) {}

  async createCity(city: ICity): Promise<ICity> {
    try {
      const cityToCreate: ICity = {
        name: city.name,
        travelFee: city.travelFee,
        status: city.status,
        activeBookings: 0,
      };

      const createdCity = await this.storageRepo.stroreCity(cityToCreate);

      if (!createdCity) {
        throw Error("City not found");
      }

      return createdCity;
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

  async getAllCities(): Promise<ICity[]> {
    try {
      const RetrievedCities = this.storageRepo.getAllCities();

      if (!RetrievedCities) {
        throw Error("No Cities Found");
      }

      return RetrievedCities;
    } catch (error) {
      throw error;
    }
  }

 async updateCity(id: number, updates: Partial<ICity>) {
  return this.storageRepo.updateCity(id, updates);
}

}

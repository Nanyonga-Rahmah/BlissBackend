import {
  DecodedToken,
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

export class ServiceController {
  constructor(
    private readonly storageRepo: IStorageRepo // private readonly logger: ILogger
  ) {}

  async createService(service: IService): Promise<IService> {
    try {
      const serviceToCreate: IService = {
        name: service.name,
        description: service.description,
        image: service.image,
        status: service.status,
      };

      const createdService =
        await this.storageRepo.storeService(serviceToCreate);

      if (!createdService) {
        throw Error("Service not found");
      }

      return createdService;
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

      if (!createdVariant) {
        throw Error("variant not found");
      }

      return createdVariant;
    } catch (error) {
      throw error;
    }
  }

  async getServiceById(id: number): Promise<IService> {
    try {
      const RetrievedService = this.storageRepo.getServiceById(id);

      if (!RetrievedService) {
        throw Error("No Service Found");
      }

      return RetrievedService;
    } catch (error) {
      throw error;
    }
  }

  async getAllServices(): Promise<IService[]> {
    try {
      const RetrievedServices = this.storageRepo.getAllServices();

      if (!RetrievedServices) {
        throw Error("No Services Found");
      }

      return RetrievedServices;
    } catch (error) {
      throw error;
    }
  }

  async updateCity(id: number, updates: Partial<ICity>) {
    return this.storageRepo.updateCity(id, updates);
  }
}

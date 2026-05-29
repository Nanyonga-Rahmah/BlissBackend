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
    private readonly storageRepo: IStorageRepo, // private readonly logger: ILogger
  ) {}

  async createService(service: IService): Promise<IService> {
    try {
      const serviceToCreate: IService = {
        name: service.name,
        description: service.description,
        image: service.image,
        status: service.status,
        variants: service.variants as number[],
        hasRemovalAddOn:service.hasRemovalAddOn || false,
        removalDetailsLength:service.removalDetailsLength || "",
        removalDetailsSize:service.removalDetailsSize || "",
        removalDetailsPrice:service.removalDetailsPrice || 0
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
        throw new Error("Variant not created");
      }

      // Get existing service
      const service = await this.storageRepo.getServiceById(variant.serviceId);

      const existingVariants = service?.variants || [];

      if (createdVariant.id === undefined) {
        throw new Error("Created variant has no id");
      }
      await this.storageRepo.updateService(variant.serviceId, {
        variants: [...existingVariants, createdVariant.id],
      });

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


  async getRemovalService(): Promise<IService[]> {
    try {
      const RetrievedService = this.storageRepo.getParticularService();

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

  async getActiveServices(): Promise<IService[]> {
    try {
      const RetrievedServices = this.storageRepo.getAllActiveServices();

      if (!RetrievedServices) {
        throw Error("No Services Found");
      }

      return RetrievedServices;
    } catch (error) {
      throw error;
    }
  }

  async deleteService(id: number): Promise<void> {
    try {
      const deletedService = this.storageRepo.deleteService(id);

      return deletedService;
    } catch (error) {
      throw error;
    }
  }

  async deleteVariant(id: number, serviceId: number): Promise<void> {
    try {
      // 1. get service
      const service = await this.storageRepo.getServiceById(serviceId);

      if (!service) {
        throw new Error("Service not found");
      }

      // 2. delete variant
      await this.storageRepo.deleteVariant(id);

      // 3. remove variant from service array
      service.variants = (service.variants ?? []).filter(
        (variantId: number) => variantId !== id,
      );

      // 4. save updated service
      await this.storageRepo.updateService(serviceId, {
        variants: service.variants,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllVariantsByServiceId(serviceId: number): Promise<IVariant[]> {
    try {
      const RetrievedVariants =
        this.storageRepo.getVariantsByServiceId(serviceId);

      if (!RetrievedVariants) {
        throw Error("No Services Found");
      }

      return RetrievedVariants;
    } catch (error) {
      throw error;
    }
  }

  async updateVariant(id: number, updates: Partial<IVariant>) {
    return this.storageRepo.updateVariant(id, updates);
  }

  async updateService(id: number, updates: Partial<IService>) {
    return this.storageRepo.updateService(id, updates);
  }
}

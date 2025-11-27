import {
  DecodedToken,
  ILink,
  ILogger,
  IStorageRepo,
  IUser,
  TAuthenticationResponse,
} from "../interfaces/interfaces.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import databaseConfig from "../config/databaseConfig.js";
import { render } from "@react-email/render";
import React from "react";
import VerifyEmail from "../views/user_verification.js";

import { Resend } from "resend";
import { error } from "console";
const secret = databaseConfig.secretStore;



const resend = new Resend(secret.resend_api);
const Resend_from = secret.from;

export class UserController {
  private readonly saltRounds = 10;
  private jwtSecretKey: string | undefined = undefined;
  constructor(
    private readonly storageRepo: IStorageRepo // private readonly logger: ILogger
  ) {}

  async authenticate(user: IUser): Promise<TAuthenticationResponse> {
    if (!this.jwtSecretKey) {
      this.jwtSecretKey = secret.secretKey;
    }
    const jwtSecret: string = secret.secretKey;
    const expiryTime: number = parseInt(secret.expiryTime);

    if (!jwtSecret || !expiryTime) {
      throw new Error("Authentication configuration error");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: `${user.firstName} ${user.lastName}`,
      },
      jwtSecret,
      {
        expiresIn: `${expiryTime}h`,
        algorithm: "HS256",
      }
    );

    return {
      token,
      isAuthenticated: true,
      userData: user,
    };
  }

  async verifyToken(
    token: string
  ): Promise<{ isValid: boolean; payload?: any }> {
    try {
      if (!this.jwtSecretKey) {
        this.jwtSecretKey = secret.secretKey;
      }
      const jwtSecret: string = secret.secretKey;

      const decoded = jwt.verify(token, jwtSecret);

      return {
        isValid: true,
        payload: decoded,
      };
    } catch (error) {
      return {
        isValid: false,
      };
    }
  }

  async refreshToken(token: string): Promise<TAuthenticationResponse> {
    try {
      if (!this.jwtSecretKey) {
        this.jwtSecretKey = secret.secretKey;
      }
      const jwtSecret: string = secret.secretKey;
      const expiryTime: number = parseInt(secret.expiryTime);

      const decoded = jwt.verify(token, jwtSecret, {
        ignoreExpiration: true,
      }) as DecodedToken;

      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = (decoded as any).exp - currentTime;

      if (expiresIn < 15 * 60) {
        const newToken = jwt.sign(
          {
            userId: decoded.id,
            username: decoded.username,
          },
          jwtSecret,
          {
            expiresIn: `${expiryTime}h`,
            algorithm: "HS256",
          }
        );

        return {
          token: newToken,
          isAuthenticated: true,
        };
      }

      return {
        token: token,
        isAuthenticated: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async onClickVerify({ email }: { email: string }): Promise<ILink> {
    const retrievedLink = await this.storageRepo.getLinkByEmail(email);
    const retrievedUser = await this.storageRepo.getUserByEmail(email);
    if (!retrievedLink) {
      throw error("Verification link does not exist");
    }

    const now = new Date();
    if (retrievedLink.expires_at && retrievedLink.expires_at < now) {
      throw error("Verification link has expired");
    }

    if (retrievedLink.isClicked) {
      throw error("Verification link has already been used");
    }

    if (!retrievedLink.id) {
      throw error("Link is missing an ID");
    }
    const updatedLink = await this.storageRepo.updateLink(retrievedLink.id, {
      isClicked: true,
    });

    await this.storageRepo.updateUser({ ...retrievedUser, isVerified: true });

    return updatedLink;
  }

  private async generateOtp(): Promise<{ id: number; expiresAt: Date }> {
    const id = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return { id, expiresAt };
  }

  async SendSignupLink(user_email: string): Promise<void> {
    const dbUser = await this.storageRepo.getUserByEmail(user_email);

    if (!dbUser) {
      throw error("User not found");
    }

    try {
      const { id, expiresAt } = await this.generateOtp();

      const html = await render(
        React.createElement(VerifyEmail, {
          name: dbUser.firstName,
          email: dbUser.email,
        })
      );


      const from = Resend_from;
      const to = user_email;
      const subject = "Verification Link";

    const response = await resend.emails.send({ to, subject, html, from });


      const link: ILink = {
        user_email,
        isClicked: false,
        expires_at: expiresAt,
      };

      await this.storageRepo.storeLink(link);
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(user: IUser): Promise<IUser> {
    try {
      const currentDate = new Date();

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const secureUser: IUser = {
        password: hashedPassword,
        firstName: user.firstName,
        createdAt: currentDate,
        isVerified: false,
        email: user.email,
        lastName: user.lastName,
      };

      const createdUser = await this.storageRepo.storeUser(secureUser);

      if (!createdUser) {
        throw Error("User not found");
      }
      await this.SendSignupLink(createdUser.email);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }
}

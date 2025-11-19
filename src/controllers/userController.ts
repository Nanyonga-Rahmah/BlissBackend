import {
  DecodedToken,
  ILogger,
  IStorageRepo,
  IUser,
  TAuthenticationResponse,
} from "../interfaces/interfaces.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import databaseConfig from "../config/databaseConfig.js";

const secret = databaseConfig.secretStore;

export class UserController {
  private readonly saltRounds = 10;
  private jwtSecretKey: string | undefined = undefined;
  constructor(
    private readonly storageRepo: IStorageRepo,
    // private readonly logger: ILogger
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


  async createUser(user: IUser): Promise<IUser> {
        try {
            const currentDate = new Date();

      const hashedPassword = await bcrypt.hash(user.password, 10);

            const secureUser: IUser = {
                password: hashedPassword,
                firstName: user.firstName,
                createdAt:currentDate,
                isVerified:false,
                // isEmailVerified: user.isEmailVerified,
                email: user.email,
                lastName: user.lastName,
             
            };

            const createdUser = await this.storageRepo.storeUser(secureUser);

            if (!createdUser) {
                throw Error("User not found");
            }



            return createdUser;
        } catch (error) {
            throw error;
        }
    }
}

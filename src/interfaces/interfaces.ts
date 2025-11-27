export interface IUser {
  id?: number;
  lastName: string;
  firstName: string;
  password: string;
  email: string;
  bookingIds?: number[];
  isVerified?: boolean;
  createdAt: Date;
}

export interface ILink {
  id?: number;

  user_email: string;

 isClicked:boolean;

  expires_at?: Date | undefined;
}

export interface IBooking {
  id?: number;
  name: string;
  bookingDay: string;
  bookingTime: string;
  isCanceled: boolean;
  status: string;
  bookingFee: string;
}

export type TLogMethod = (message: string | Error, meta?: unknown) => void;
export type TJson =
  | string
  | number
  | boolean
  | { [x: string]: TJson }
  | Array<TJson>
  | unknown;
export type TAuthenticationResponse = {
  isAuthenticated?: boolean;
  token: string;
  userData?: any;
};

export interface ILogger {
  error: TLogMethod;
  warn: TLogMethod;
  trace: TLogMethod;
  info: TLogMethod;
  verbose: TLogMethod;
  debug: TLogMethod;
  silly: TLogMethod;
  child(context?: TJson): ILogger;
}

export interface DecodedToken {
  id: number;
  username: string;
}

export interface IStorageRepo {
  init(): Promise<void>;
  destroy(): Promise<void>;

  storeUser(user: IUser): Promise<IUser>;
  getUserByEmail(user_email:string):Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  storeLink(link:ILink):Promise<ILink>
  getLinkByEmail(user_email:string):Promise<ILink>;
  getLinkById(id:number):Promise<ILink>;
  updateLink(id: number, updates: Partial<ILink>):Promise<ILink>;

}

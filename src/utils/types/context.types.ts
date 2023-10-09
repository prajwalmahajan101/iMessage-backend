import { ISODateString } from "next-auth";
import { PrismaClient } from "@prisma/client";

export interface IGraphQLContext {
  session: ISession | null;
  prisma: PrismaClient;
  // pubsub
}

export interface ISession {
  user: IUser;
  expires: ISODateString;
}

export interface IUser {
  name: string;
  email?: string;
  image: string;
  id: string;
  username?: string;
  emailVerified?: ISODateString;
}

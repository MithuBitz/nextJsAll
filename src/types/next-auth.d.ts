//This files helps to update some next-auth module which is already exist on next-auth
//This is becoz to enhance the capability of next-auth module which are use in callback of next-auth providers

import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    acceptingMessage?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      acceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

//Another short way to modify interface of a module
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    acceptingMessage?: boolean;
    username?: string;
  }
}

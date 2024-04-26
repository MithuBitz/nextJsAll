import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        //Connect with db
        await dbConnect();
        try {
          //Find the user with the email or the username bcoz user is saved by email and username on the database
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          //If user is not found then throw an error
          if (!user) {
            throw new Error("User not found with this email and password");
          }
          //If user is  not varify then also throw an error
          if (!user.isVarified) {
            throw new Error("Please varify the user befor login");
          }

          //Check the password is correct through campareing with the database saved password by decrypt
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          //if password is correct return the user
          if (isPasswordCorrect) {
            return user;
          } else {
            //else throw an error
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err); // Must throw error when anything wrong
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        //we must update the user interface of next-auth in next-auth.d.ts file
        session.user._id = token._id;
        session.user.acceptingMessage = token.acceptingMessage;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      //To manually add new field on token of next-auth so that its has some field to enhance its capability
      //basically it helps to not always talk with the database
      if (user) {
        //we must update the user interface of next-auth in next-auth.d.ts file
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.acceptingMessage = user.acceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, //Its must otherwise it causes error
};

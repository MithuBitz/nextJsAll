import mongoose, { Schema, Document } from "mongoose";

//Create a interface which is extends with mongoose Document
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

//Create a schema with help of the interface
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String, //In mongoose type is "String" and in ts it is "string"
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

//Create a interface for User document
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  varifyCode: string;
  varifyCodeExpiry: Date;
  isVarified: boolean;
  acceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/,
      "Please use a valid email address",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  varifyCode: {
    type: String,
    required: [true, "Varify code is required"],
  },
  varifyCodeExpiry: {
    type: Date,
    required: [true, "Varify code expiry is must"],
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  acceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema], //if type is from a custom schema
});

//Create a user model to retrive the user data from the mongoDb [first () ] or if not exist create new user data in mongo [second () ]
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

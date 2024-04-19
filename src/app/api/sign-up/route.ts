import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVarificationEmail } from "@/helper/sendVarificationEmail";

//Routes are declared like this in Nextjs with function name like POST,GET,PATCH,etc.
export async function POST(request: Request) {
  await dbConnect();

  try {
    //Always await the request.json() to get the data from the frontend
    const { username, email, password } = await request.json();

    //Get the existing user by username
    const existingVarifiedUserByUsername = await UserModel.findOne({
      username,
      isVarified: true,
    });

    //if varify user is exist then return a response to frontend
    if (existingVarifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exist",
        },
        {
          status: 400,
        }
      );
    }

    //Get the existing user by email
    const existingUserbyEmail = await UserModel.findOne({ email });
    //Create a variable to hold a random number as a varify code
    let varifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    //if the user is varified by  email then return the response
    if (existingUserbyEmail) {
      if (existingUserbyEmail.isVarified) {
        return Response.json(
          {
            success: false,
            message: "User is already varified with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        //else if not varified by email then save the new password and varify code and also varify code expiry
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserbyEmail.password = hashedPassword;
        existingUserbyEmail.varifyCode = varifyCode;
        existingUserbyEmail.varifyCodeExpiry = new Date(Date.now() + 360000);
        await existingUserbyEmail.save();
      }
    } else {
      //Else  the user is not exist by email then create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Add 1 from now which is the expiry time

      //Create a new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        varifyCode,
        varifyCodeExpiry: expiryDate,
        isVarified: false,
        acceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //Send varification mail
    const emailResponse = await sendVarificationEmail(
      username,
      email,
      varifyCode
    );
    //if email is not successfully send then return response to the user
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Varification email send successfully, please varify it",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    //error display in console
    console.error("Error in registering user", error);
    //Eroor send to frontend
    return Response.json(
      {
        success: false,
        message: "Error Registering user",
      },
      {
        status: 500,
      }
    );
  }
}

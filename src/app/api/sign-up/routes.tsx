import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import userModel from "@/app/models/user";

export async function POST(request: Request) {
  try {
    dbConnect();
    const { username, email, password } = await request.json();

    const existingUserVerifiesByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiesByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already verified",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        (existingUserByEmail.password = hashedPassword),
          (existingUserByEmail.verifyCode = verifyCode),
          (existingUserByEmail.verifyCodeExpiry = new Date(
            Date.now() + 3600000
          ));
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isMessageAccepting: true,
        messages: [],
      });

      await newUser.save();
    }

    //sending verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error while registering user", error);
    return Response.json(
      {
        success: false,
        message: "error ocurred while registering user",
      },
      { status: 500 }
    );
  }
}

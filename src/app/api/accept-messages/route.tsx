import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "UnAuthoroize Request",
      },
      { status: 404 }
    );
  }

  const userId = user?._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isMessageAccepting: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "user message acceptance updation failed",
        },
        { status: 402 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user message acceptance updation occurred successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("updating user message enablation failed");
    return Response.json(
      {
        success: false,
        message: "updating user message enablation failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "UnAuthoroize Request",
      },
      { status: 404 }
    );
  }

  const userId = user?._id;

  const foundUser = await userModel.findById(userId);

  try {
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to found user",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 202 }
    );
  } catch (error) {
    console.log("failed to get the user");
    return Response.json(
      {
        success: false,
        message: "failed to get the user",
      },
      { status: 500 }
    );
  }
}
 
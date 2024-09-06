import { Message } from "@/app/models/user";
import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/app/models/user";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, content } = await request.json();
    const user = await userModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 403 }
      );
    }

    if (!user.isMessageAccepting) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Internal server error while sending message: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error while sending message",
      },
      { status: 500 }
    );
  }
}

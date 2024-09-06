import dbConnect from "@/app/lib/dbConnect";
import userModel from "@/app/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
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
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await userModel.aggregate([
            {$match: {id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "_id", messages: {$push: "$messages"}}}
        ])

        if (!user || (await user).length) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },{status: 400}
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },{status: 201}
        )
    } catch (error) { 
        console.log("error ocurred while finding user", error);
        return Response.json(
            {
                success: false,
                message: "error ocurred while finding user"
            },{status: 500}
        )
    }
}
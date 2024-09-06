import dbConnect from "@/app/lib/dbConnect";
import {z} from "zod"
import userModel from "@/app/models/user";
import { usernameValidation } from "@/app/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET (request: Request){
    dbConnect()

    try {
        const {searchParams} = new URL (request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        //validation with zoid
        const result = UsernameQuerySchema.safeParse(queryParam)

       if (!result.success){
        return Response.json(
            {
                status: false,
                message:"error while fetching username"
            },{status: 500}
        )
       }

       const {username} = result.data

       const existingVerifiedUser = await userModel.findOne({
        username, isVerified: true
       })

       if (existingVerifiedUser) {
             return Response.json(
                {
                    success: false,
                    message: "username already exists"
                },{status: 400}
             )
       }

       return Response.json(
        {
            success: true,
            message: "username is available"
        },{status: 200}
       )
    } catch (error) {
        console.log("error while searching username", error);
        return Response.json(
            {
                success: false,
                message: "error while searching username"
            },{status: 500}
        )
    }
}
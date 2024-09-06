import userModel from "@/app/models/user";
import dbConnect from "@/app/lib/dbConnect";

export async function POST (request: Request){
    dbConnect()
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await userModel.findOne({
            username: decodedUsername
        })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },{status: 402}
            )
        }

        const isCodeValid =  user.verifyCode === code
        const isCodeNotExpired = new Date (user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired){
            user.isVerified = true
            return Response.json(
                {
                     success: true,
                    message: "User is verified"
                },{status: 201}
            )
        }
        else if (!isCodeNotExpired){
            return Response.json(
                {
                     success: false,
                    message: "verification code is expired"
                },{status: 405}
            )
        }

        else{
            return Response.json(
                {
                     success: false,
                    message: "verification code is incoorect"
                },{status: 404}
            )
        }
    } catch (error) {
        console.log("error while verification", error);
        return Response.json(
            {
                 success: false,
                message: "verification failed"
            },{status: 404}
        )
    }


}
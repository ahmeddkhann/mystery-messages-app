import { NextAuthOptions } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import bcrypt from "bcryptjs";
import userModel from "@/app/models/user";
import  CredentialsProvider  from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider ({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },

            async authorize(credentials: any): Promise<any> {
                try {
                    await dbConnect();
                    const user = await userModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ],
                    })
    
                    if (!user){
                        throw new Error("no user found with this email or username")
                    }
                    if (!user.isVerified){
                        throw new Error("user is not verified")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(!isPasswordCorrect){
                        throw new Error ("password is incorrect")
                    }else{
                        return user
                    }
                } catch (error: any) {
                    throw new Error (error.message)
                }
            }
        })
    ],
    callbacks: {
          async jwt({ token, user}) {
            if (user){
                token._id = user._id
                token.isVerified = user.isVerified,
                token.isAcceptingMessage = user.isAcceptingMessage,
                token.username = user.username
            }
            return token
          },
          
          async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        }
    }, 
    pages:{
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
};

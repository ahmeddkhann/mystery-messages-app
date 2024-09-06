import { DefaultSession } from "next-auth";
import "next-auth"

declare module "next-auth" {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: string;
            isAcceptingMessage?: string;
            username?: string;
        } & DefaultSession["user"]
    }

    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}

// here in this code we are overwriting the
// actual values of next auth with custom values just so we don't
// have an issue when we take value from users or token in Auth routes 
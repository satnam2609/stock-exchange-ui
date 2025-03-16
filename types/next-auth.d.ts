import { DefaultUser,DefaultSession } from "next-auth";

declare module "next-auth"{
    interface User extends UserDefault{
        id:string
    }

    interface Session{
        user:User
    }
}
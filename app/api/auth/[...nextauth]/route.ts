import { connectDB } from "@/lib/db";
import User from "@/models/user";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET_KEY as string,
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Ensure it's set
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { name, email } = user;

        // Check whether the user exists in the DB or not?
        await connectDB();
        const userExists = await User.findOne({ email });
        if (!userExists) {
          // We have to create this new user

          const response = await fetch(`http://localhost:3000/api/user`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ name, email }),
          });

          if (!response.ok) {
            return false;
          }
        }
        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ensure user ID is stored in the token
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string; // Assign the user ID
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };

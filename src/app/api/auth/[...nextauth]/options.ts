import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";

export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                console.log("Connecting to database...");
                await dbConnect();

                try {
                    console.log("Finding user...");
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        console.error("User not found");
                        throw new Error("User not found with this email or username");
                    }

                    if (!user.isVerified) {
                        console.error("User not verified");
                        throw new Error("Please verify your account first");
                    }

                    const isPasswordCorrect = await bcryptjs.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        console.error("Incorrect password");
                        throw new Error("Incorrect password");
                    }

                    console.log("Authentication successful for user:", user.username);
                    return user;
                } catch (err: any) {
                    console.error("Error during authentication:", err.message);
                    throw new Error(err.message || "An unexpected error occurred");
                }
            },
        }),
    ],
    pages: {
        signIn: "/sign-in", // Ensure this page exists in your project
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            console.log("Session created:", session);
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            console.log("JWT updated:", token);
            return token;
        },
    },
};

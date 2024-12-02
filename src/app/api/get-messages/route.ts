import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";

import { User } from 'next-auth'
import mongoose from "mongoose";
import { group } from "console";


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated user"
            },
            {
                status: 401
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await userModel.aggregate([
            {
                $match: { id: userId }
            },
            {
                $unwind: '$message'
            },
            {
                $sort: { 'message.createdAt': -1 }
            },
            {
                $group: { _id: '$_id', message: { $push: "$messages" } }
            }
        ])

        if (!user || user.length == 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 401
            }
        )
    }
}
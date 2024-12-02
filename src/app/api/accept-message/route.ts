import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import { User } from 'next-auth'


export async function POST(request: Request) {
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

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages
            },
            {
                new: true
            }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update status to accept messages"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance satus updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log('Failed to update status to accept messages')
        return Response.json(
            {
                success: false,
                message: "Failed to update status to accept messages"
            },
            {
                status: 500
            }
        )
    }
}

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
    const userId = user._id;

    try {
        const foundUser = await userModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not  found"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage,
                message: "Is accepting messages"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log('Failed to update status to accept messages')
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            {
                status: 500
            }
        )
    }
}
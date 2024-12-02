import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json()

    try {
        const user = await userModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found "
                },
                {
                    status: 404
                }
            )
        }

        // is user accepting message 
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "user not accepting the messages"
                },
                {
                    status: 403
                }
            )
        }


        const newMessages = { content, createdAt: new Date() }

        user.message.push(newMessages as Message)

        await user.save()
        return Response.json(
            {
                success: false,
                message: "Message send successfully"
            },
            {
                status: 403
            }
        )


    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "user not accepting the messages"
            },
            {
                status: 500
            }
        )
    }
}
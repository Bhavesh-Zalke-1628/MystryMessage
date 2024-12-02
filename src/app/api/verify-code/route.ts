import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await userModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 500
                }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpity) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {
                    status: 200
                }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "verification code has exprired plase sign up again to get new code"
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                {
                    status: 500
                }
            )
        }


    } catch (error) {
        console.error("Verifying user", error)
        return Response.json(
            {
                success: false,
                message: "Failed to verify user"
            },
            {
                status: 500
            }
        )
    }
}



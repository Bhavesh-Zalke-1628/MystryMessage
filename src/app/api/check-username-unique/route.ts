import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import { z } from 'zod'
import { userNameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: userNameValidation
})


export async function GET(request: Request) {

    console.log(request.method)

    // use this is in another routes

    // if (request.method !== "GET") {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "Method not allowed"
    //         },
    //         {
    //             status: 405
    //         }
    //     )
    // }

    await dbConnect()
    // localhost:3000/api/cuu?username=bhavsh
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)

        console.log(result)

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError.length > 0 ?
                        usernameError.join(",") :
                        "Invalid query param"
                },
                {
                    status: 400
                }
            )
        }
        console.log(result.data)
        const { username } = result.data

        const existingVerifiedUser = await userModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                })
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            },
            {
                status: 200
            })

    } catch (error) {
        console.error("Checking username", error)
        return Response.json(
            {
                success: false, message: "Error checking username"

            },
            {
                status: 500
            }
        )
    }
}
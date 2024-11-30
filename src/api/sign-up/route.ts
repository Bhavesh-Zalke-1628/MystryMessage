import dbConnect from "@/lib/dbconnect";
import userModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { ifError } from "assert";
import { date } from "zod";



export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json()
        const exitstingUserVerifiedByUsername = await userModel.findOne({ userName, isVerified: true })

        if (exitstingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },
                {
                    status: 400
                }
            )
        }

        const exitstingUserVerifiedByEmail = await userModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
        if (exitstingUserVerifiedByEmail) {
            if (exitstingUserVerifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exit with this email"
                }, { status: 400 })
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                exitstingUserVerifiedByEmail.password = hashPassword
                exitstingUserVerifiedByEmail.verifyCode = verifyCode
                exitstingUserVerifiedByEmail.verifyCodeExpity = new Date(Date.now() + 3600000)
                await exitstingUserVerifiedByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)


            const newUser = new userModel({
                userName: username,
                email,
                password: hashPassword,
                verifyCode: verifyCode,
                verifyCodeExpity: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })
            await newUser.save();
        }

        // send verification email

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        console.log(emailResponse)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }


        return Response.json({
            success: true,
            message: "User register successfully,Please verify your email",
        }, { status: 200 })
    } catch (error) {
        console.error("Registering Error", error)
        return Response.json({
            success: false,
            message: "Error registring user"
        },
            {
                status: 400
            }
        )
    }
}
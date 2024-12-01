import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
    contetn: string,
    createdAt: Date
}


const MessageSchema: Schema<Message> = new Schema({
    contetn: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpity: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    message: Message[]
}


const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address "]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {

        type: String,
        required: [true, "verify code is required"],
    },
    verifyCodeExpity: {
        type: Date,
        required: [true, "verify code expity is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageSchema]
})



const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)



export default userModel;
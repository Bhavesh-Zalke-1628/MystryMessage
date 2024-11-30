import { Resend } from "resend";


export const resend = new Resend(process.env.RESENT_API_KEY)

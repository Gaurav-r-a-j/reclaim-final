import {createTransport} from "nodemailer"
import env from "../util/validateEnv"

const transport = createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PWD,
    }
})

export const sendEmailVerificationCode = async (toEmail: any, code: number) => {
    const answer =  await transport.sendMail({
        from: 'noreply@blogVault.com',
        to: toEmail,
        subject: "Verify your email",
        html: ` 
              <h1>Verify your email</h1>
              <p>Enter the following code to verify your email: <h2><strong>${code}</strong></h2></p>
              `
    })
    return answer;
   
}

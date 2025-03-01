import { StaticMessage } from "../../constants/StaticMessages";
import { userCreatedEmailTemplate } from "../../helpers/emailTemplates/userCreatedEmailTemplate";
import { emailTransporter } from "../../helpers/emailTransporter";

export class EmailController {
  async sendUserCreatedEmail(user: any, password?: string): Promise<void> {
    try {
      const options = {
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: `Welcome to EZTest AI, ${user.full_name}!`,
        html: userCreatedEmailTemplate(user, password),
      };
      const  mailStatus = await emailTransporter.sendMail(options);
      if (!mailStatus) {
        throw new Error(StaticMessage.UserCreatedEmailFailed);
      }
    } catch (error: any) {
      throw error;
    }
  }
}

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const templatePath = path.join(process.cwd(), "templates", "email.html");
const htmlTemplate = fs.readFileSync(templatePath, "utf8");

export const sendOtpEmail = async (toEmail, otp) => {
  const htmlBody = htmlTemplate.replace("{{OTP_CODE}}", otp);

  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: { Data: "CyberCarnival Verification Code" },
      Body: {
        Html: { Data: htmlBody },
        Text: { Data: `Your OTP is: ${otp}` },
      },
    },
  };

  const command = new SendEmailCommand(params);
  return await sesClient.send(command);
};
import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({ to, subject, html, text }: SendMailOptions) {
  const transport = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transport.sendMail({
    from: 'DropOX',
    to,
    subject,
    html,
    text,
  });
}
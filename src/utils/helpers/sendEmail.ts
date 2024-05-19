import config from '../../config/config';

// nodemailer module is used to send emails
import nodemailer from 'nodemailer';

const mailConfig = {
  host: config.email_host,
  port: config.email_port,
  secure: true,
  auth: {
    user: config.email,
    pass: config.email_password,
  },
};

const transporter = nodemailer.createTransport(mailConfig as any);

async function sendEmail(to: string, subject: string, html: string) {
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log({ success });
      console.log('Server is ready to take our messages');
    }
  });

  console.log({ to, subject, html });

  const info = await transporter.sendMail({
    from: `"Do-not-reply" ${config.email}`,
    to,
    subject,
    html,
  });

  return info;
}

export default sendEmail;

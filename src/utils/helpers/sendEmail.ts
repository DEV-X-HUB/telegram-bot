import config from '../../config/config';

// nodemailer module is used to send emails
const nodemailer = require('nodemailer');
const mailConfig = {
  host: config.email_host,
  port: config.email_port,
  secure: true,
  auth: { user: config.email, pass: config.email_password },
};

const transporter = nodemailer.createTransport(mailConfig as any);

async function sendEmail(to: string, subject: string, html: string) {
  try {
    transporter.verify(function (error: any, success: any) {
      if (error) {
        console.log(error);
      } else {
        console.log({ success });
      }
    });

    const info = await transporter.sendMail({ from: `"Do-not-reply" ${config.email}`, to, subject, html });

    return info;
  } catch (error) {
    console.error('error while sending email', { error });
    return 'email_error';
  }
}

export default sendEmail;

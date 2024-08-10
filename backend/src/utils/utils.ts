import { Logger } from "@nestjs/common";

const logger = new Logger('App');

export const sendEmail = (email: string,
    subject: string,
    body: string,
    htmlBody: string = '',
    from: string = 'support@fastfriends.biz'): boolean => {

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('info', email + ' sending with:' + process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: from,
    subject: subject,
    text: body,
    html: htmlBody,
  }
  return sgMail
    .send(msg)
    .then(() => {
      logger.log('Email sent to'+ email);
      return true;
    })
    .catch((error) => {
      logger.error("Error sending email: " + error.message);
      return false;
    })
}
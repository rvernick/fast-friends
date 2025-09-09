import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const mgClient = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});

export const sendMailgunEmail = async (email: string,
  subject: string,
  body: string,
  htmlBody: string = '',
  from: string = 'support@pedal-assistant.com'): Promise<boolean> => {

  const apiKey = process.env.MAILGUN_API_KEY
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: "api", key: apiKey });
  try {
    const sendResult = await mg.messages.create("email.pedal-assistant.com", {
      from: "Pedal Assistance Support <support@pedal-assistant.com>",
      to: email,
      subject: subject,
      text: body,
    });

    console.log(sendResult); // logs response data
    return sendResult.status == 200;
  } catch (error) {
    console.log(error); //logs any error
  }
  return Promise.resolve(false);
}

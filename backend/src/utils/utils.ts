import { Logger } from "@nestjs/common";
import { Expo } from 'expo-server-sdk';
import { User } from "../user/user.entity";
import { randomInt } from "crypto";

const logger = new Logger('App');
export const tenMinutesInMilliseconds = 1000 * 60 * 10;

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV !== 'production';
}

export const createSixDigitCode = (): string => {
  const basis = randomInt(1000001, 9999999);
  // console.log('random basis:'+ basis);
  const basisString = basis.toString();
  return basisString.substring(1, 7);
}

export const sendEmail = (email: string,
    subject: string,
    body: string,
    htmlBody: string = '',
    from: string = 'support@pedal-assistant.com'): boolean => {

  try {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('info', email + ' sending with body:' + body);
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
      logger.log('Email sent to: '+ email);
      return true;
    })
    .catch((error) => {
      logger.error("Error sending email: " + error.message);
      logger.log('info', 'Failed to send email to'+ error);
      return false;
    })
  } catch (error) {
    logger.error('Error in sendMail: '+ error.message);
    return false;
  }
}

export interface PushNotification {
  user: User;
  title: string;
  subtitle: string;
  data: any;
  body: string;
}

export const sendPushNotifications = async (notifications: PushNotification[]) => {
  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  let expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
  });

  const messages = [];
  for (let notification of notifications) {
    const pushToken = notification.user.pushToken;
    if (Expo.isExpoPushToken(pushToken)) {
      messages.push({
        to: notification.user.pushToken,
        sound: 'default',
        title: notification.title,
        subtitle: notification.subtitle,
        data: notification.data,
        body: notification.body,
      });
    } else {
      console.error(`Push token ${pushToken} is not a valid Expo push token.`);
    }
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
}


/**
// Later, after the Expo push notification service has delivered the
// notifications to Apple or Google (usually quickly, but allow the service
// up to 30 minutes when under load), a "receipt" for each notification is
// created. The receipts will be available for at least a day; stale receipts
// are deleted.
//
// The ID of each receipt is sent back in the response "ticket" for each
// notification. In summary, sending a notification produces a ticket, which
// contains a receipt ID you later use to get the receipt.
//
// The receipts may contain error codes to which you must respond. In
// particular, Apple or Google may block apps that continue to send
// notifications to devices that have blocked notifications or have uninstalled
// your app. Expo does not control this policy and sends back the feedback from
// Apple and Google so you can handle it appropriately.
let receiptIds = [];
for (let ticket of tickets) {
  // NOTE: Not all tickets have IDs; for example, tickets for notifications
  // that could not be enqueued will have error information and no receipt ID.
   if (ticket.status === 'ok') {
    receiptIds.push(ticket.id);
  }
}

let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
(async () => {
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === 'ok') {
          continue;
        } else if (status === 'error') {
          console.error(
            `There was an error sending a notification: ${message}`
          );
          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
})();
**/
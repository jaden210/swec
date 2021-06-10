import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/lib/providers/auth";
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// const request = require("request-promise");
// const urlBuilder = require("build-url");
/* $ firebase functions:config:get to list environment variables */
// const stripe = require("stripe")(functions.config().stripe.key);

// exports.newUserCreated = functions.firestore
//   .document("/users/{userId}")
//   .onCreate((snapshot, context) => {
//     const user = snapshot.data() || {};
//     const nodemailer = require("nodemailer");
//     const mailTransport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "support@lenswindow.com",
//         pass: "phoropter00",
//       },
//     });
//     const mailOptions: any = {
//       from: '"LensWindow" <support@lenswindow.com>',
//       to: user.email,
//     };
//     mailOptions.subject = "Welcome to LensWindow!";
//     const nameArr = user.name ? user.name.split(" ") : null;
//     const name = nameArr && nameArr.length ? nameArr[0] : null;
//     const welcomeText = name ? `Hi ${name},` : "Hi there,";
//     const text = `${welcomeText}<br/><br/>
//     Welcome to LensWindow! We hope you find value in recording your unique life journey in audio, and that you’ll share it with others. Below are a few important details as you get started.<br/><br/>
//     You have full control over the privacy of your content within the app. Your Audiobiography can be made either private or public from within the app. If you make it private, friends and family who want to connect to your story and listen within the app will have to request access from you. If you leave it public, anyone who connects to you within the app can listen to your story. You always have control over those settings.<br/><br/>
//     You can access your account online and download your own audio for safe keeping. Just head to <a href="https://audiobiography.com">https://audiobiography.com</a>, sign in, and scroll to the bottom of your account page. You’ll see a button to download audio.<br/><br/>
//     Our FAQ page holds answers to many questions, but if there’s anything we can help you with, please email <a>support@audiobiography.com</a> and we’ll get back to you right away.<br/><br/>
//     Happy recording, and thank you from our entire team.<br/><br/>
//     MiKayla<br/>
//     Audiobiography<br/>
//     <a>support@audiobiography.com</a><br/>
//     <a href='https://audiobiography.com'>https://audiobiography.com</a><br/>
//     <a href='https://play.google.com/store/apps/details?id=com.audiobiography.audiobiography'>Get Audiobiography on Google Play</a><br/>
//     <a href="https://itunes.apple.com/us/app/audiobiography/id1463429800?ls=1&mt=8" target="_blank">Get Audiobiography on the App Store</a>
//     `;
//     mailOptions.html = text;
//     return mailTransport
//       .sendMail(mailOptions)
//       .then(() =>
//         console.log(`New account creation email sent to: ${user.email}`)
//       )
//       .catch((error: any) => {
//         console.error(
//           `An error occured sending a transaction email to ${
//             user.email
//           }. Error: ${JSON.stringify(error)}`
//         );
//       });
//   });

exports.sendInviteEmailToExistingUser = functions.https.onCall(
  (data, context) => {
    const email = data.email;
    const name = data.name;
    const inviter = data.inviter;
    const practice = data.practice;
    return sendInviteEmail(email, "", name, practice, inviter);
  }
);

/* Creates a new location and fills with contacts collection */
exports.createLocation = functions.https.onCall((data, context) => {
  const locationName = data.locationName;
  const userId = data.userId;
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection(`contacts`)
      .get()
      .then((querySnapshot: any) => {
        let today = new Date();
        const body: ILocation = {
          createdAt: new Date(),
          disabledAt: null,
          createdBy: userId,
          locationName,
          expiresAt: new Date(today.setMonth(today.getMonth() + 1)),
          admins: [userId],
          users: [],
          stripeProfile: {},
          lastPaymentFailed: false,
          inFreeTrial: true,
          quoteCTAText: "Call or text to order",
          quoteCustomText: null,
          quoteBenefitText: "Vision plan benefit",
          quoteRebateText: "Manufacturer rebate",
          quoteInnerMargin: 0,
          quoteTaxExempt: false,
          quoteLetterheadUrl: null,
          quoteLetterheadScale: 1,
          quoteLetterheadMarginLeft: 0,
          quoteLetterheadMarginTop: 0,
        };
        admin
          .firestore()
          .collection("locations")
          .add(body)
          .catch((err: any) => {
            throw new functions.https.HttpsError("unknown", err.message, err);
          })
          .then((docRef: any) => {
            querySnapshot.forEach((doc: any) => {
              admin
                .firestore()
                .collection(`locations/${docRef.id}/contacts`)
                .add({ ...doc.data() });
            });
            resolve(docRef.id);
          });
      });
  });
});

exports.createUser = functions.https.onCall((data) => {
  const email = data.email,
    name = data.name,
    practice = data.practice,
    inviter = data.inviter;
  if (!email || !name) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with an email, name and password"
    );
  }
  const password = generatePassword();
  return admin
    .auth()
    .createUser({
      email,
      password,
      disabled: false,
      displayName: name,
    })
    .then((user: UserRecord) =>
      Promise.all([
        createUserDoc(user),
        sendInviteEmail(email, password, name, practice, inviter),
      ]).then(([userId, res]) => userId)
    )
    .catch((error: any) => {
      console.error(new Error(error));
      throw new functions.https.HttpsError("already-exists", error.message);
    });
});

const createUserDoc = (user: UserRecord) => {
  console.log(user);
  const doc = admin.firestore().doc(`/users/${user.uid}`);
  return doc
    .set({
      disabledAt: null,
      email: user.email,
      name: user.displayName,
      id: user.uid,
    })
    .then(() => user.uid)
    .catch((error: any) => {
      console.error(new Error(error));
      throw new functions.https.HttpsError("unknown", error.message);
    });
};

const sendInviteEmail = (
  email: string,
  password: string,
  name: string,
  practice: string,
  inviter: string
) => {
  const nodemailer = require("nodemailer");
  const mailTransport = nodemailer.createTransport(
    `smtps://support@lenswindow.com:phoropter00@smtp.gmail.com`
  );
  const mailOptions: any = {
    from: '"LensWindow" <support@lenswindow.com>',
    to: email,
  };
  mailOptions.subject = "Welcome to LensWindow!";
  const nameArr = name ? name.split(" ") : null;
  const toName = nameArr && nameArr.length ? nameArr[0] : null;
  const welcomeText = name ? `Hi ${toName},` : "Hi there,";
  const loginCreds = password
    ? `Username: ${email}<br/>
  Password: ${password}<br/><br/>
  You can change your password at any time in your account.<br/><br/>`
    : "";
  const text = `${welcomeText}<br/><br/>
  ${inviter} just invited you to join <b>${practice}</b> on LensWindow! Head on over to <a href="https://lenswindow.com">https://lenswindow.com</a> to sign in.<br/><br/>
  ${loginCreds}
  ----------------------------------<br/>
  <a>support@lenswindow.com</a><br/>
  <a href="https://lenswindow.com">https://lenswindow.com</a>
  `;
  mailOptions.html = text;
  return mailTransport
    .sendMail(mailOptions)
    .then(() => console.log(`New account creation email sent to: ${email}`))
    .catch((error: any) => {
      console.error(
        `An error occured sending a transaction email to ${email}. Error: ${JSON.stringify(
          error
        )}`
      );
      console.error(new Error(error));
      throw new functions.https.HttpsError("unknown", error.message);
    });
};

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

interface ILocation {
  createdAt: Date;
  disabledAt: Date | null;
  createdBy: string;
  locationName: string;
  expiresAt: Date;
  admins: string[];
  users: string[];
  stripeProfile: any;
  lastPaymentFailed: boolean;
  inFreeTrial: boolean;
  quoteCTAText: string | null;
  quoteCustomText: string | null;
  quoteBenefitText: string;
  quoteRebateText: string;
  quoteInnerMargin: number;
  quoteTaxExempt: boolean;
  quoteLetterheadUrl: string | null;
  quoteLetterheadScale: number;
  quoteLetterheadMarginLeft: number;
  quoteLetterheadMarginTop: number;
}

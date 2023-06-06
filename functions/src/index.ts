import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();
import * as moment from "moment-timezone";
// const twilio = require('twilio');
// const MessagingResponse = twilio.twiml.MessagingResponse;
// const request = require("request-promise");
// const urlBuilder = require("build-url");
/* $ firebase functions:config:get to list environment variables */
// const stripe = require("stripe")(functions.config().stripe.key);


function sendMessage(body: string): Promise<any> {
  const accountSid = "AC715f0cd71c9c816c3629319ea5d61b05";
  const authToken = "d85ba1fe80e1f08322a2154701ff7408";
  const client = require('twilio')(accountSid, authToken);
  let db: any = {
    body: body,
    from: `+14352362993`,
    to: `+15599773538`
  }
  return client.messages.create(db);
}



// exports.createCalEvent = functions.https.onRequest((req, res) => {
//   const data = req.body;
//   admin.firestore().collection("cal-events").add({
//     name: data.name,
//     createdAt: data.createdAt,
//     appointment: data.payload.startTime,
//     attendees: data.payload.attendees,
//     description: data.payload.description
//   }).then((ren: any) => {
//     functions.logger.log(`done: ${ren}`)
//     res.end();
//   }, (error: any) => {
//     functions.logger.log(`error: ${error}`)
//     res.send(error);
//   }).error((error2: any) => {
//     functions.logger.log(`error: ${error2}`)
//   })
// });

exports.newAppointmentCreated = functions.firestore
  .document("/appointments/{appointmentId}")
  .onCreate((snapshot: any, context: any) => {
    const appointment = snapshot.data() || {};
    if (appointment.confirm) {
      return null;
    } else {
      const appointmentDate = moment(appointment.appointment.toDate()).tz("America/Denver").format("dddd, MMMM Do YYYY, h:mm a");
      let tBody = `New Appointment Alert! 🙌🙌 \n\n${appointment.name} \n${appointmentDate} \n${appointment.number || ''} \n${appointment.instagram || ''} \nhttps://kokomosprays.com/sms?id=${snapshot.id}`;
      return sendMessage(tBody);
    }


    // const nodemailer = require("nodemailer");
    // const mailTransport = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "kokomosprays@gmail.com",
    //     pass: "getaspraytan",
    //   },
    // });
    // const mailOptions: any = {
    //   from: '"Kokomo Spray Tans" <kokomosprays@gmail.com>',
    //   to: "madisonkm613@gmail.com",
    // };
    // mailOptions.subject = "You booked a new Appointment!";
    // const text = `Hey Girlfriend!<br/><br/>
    // You just booked another appointment! 🙌🙌 Here are the deets:<br><br>
    // ${appointment.name}<br>
    // ${appointmentDate}<br>
    // ${appointment.number}<br>
    // <a href="https://kokomosprays.com/sms?id=${snapshot.id}">Send them a Confirmation Text</a><br/><br>
 


    // See all your appointments here:<br/>
    // <a href='https://kokomosprays.com/admin'>appointments</a><br/><br>
    // <a>kokomosprays@gmail.com</a><br/>
    // `;
    // mailOptions.html = text;
    // return mailTransport
    //   .sendMail(mailOptions)
    //   .then(() =>
    //     console.log(`New appointment creation email sent to Madison`)
    //   )
    //   .catch((error: any) => {
    //     console.error(
    //       `An error occurred sending a transaction email to Madison. Error: ${JSON.stringify(error)}`
    //     );
    //   });
  });

exports.newContactCreated = functions.firestore
  .document("/contacts/{contactId}")
  .onCreate((snapshot: any, context: any) => {
    const contact = snapshot.data() || {};
    const nodemailer = require("nodemailer");
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kokomosprays@gmail.com",
        pass: "getaspraytan",
      },
    });
    const mailOptions: any = {
      from: '"Kokomo Spray Tans" <kokomosprays@gmail.com>',
      to: "madisonkm613@gmail.com",
    };
    mailOptions.subject = "You have a new contact!";
    const text = `Woah, nice work!<br/><br/>
    Someone has signed up to start getting text updates! Check them out:<br><br>
    ${contact.name || "they didn't provide their name"}<br>
    ${contact.number}<br>
    ${contact.ig}<br>
    <a href="https://kokomosprays.com/contacts">Go to your contact list</a><br/><br>
 
    <a href='https://kokomosprays.com/admin'>Go yo your Admin Console</a><br/><br>
    <a>kokomosprays@gmail.com</a><br/>
    `;
    mailOptions.html = text;
    return mailTransport
      .sendMail(mailOptions)
      .then(() =>
        console.log(`New contact creation email sent to Madison`)
      )
      .catch((error: any) => {
        console.error(
          `An error occurred sending a contact email to Madison. Error: ${JSON.stringify(error)}`
        );
      });
  });

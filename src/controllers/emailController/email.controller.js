"use strict"
require('dotenv').config();
const {MAIL_PASS, MAIL_USER, MAIL_SMTP} = process.env;

const nodemailer = require("nodemailer");

module.exports = class MailController {
  static sendEmail = async (to, subject, html) => {
    let transporter = nodemailer.createTransport({
      service:"Godaddy",
      host: MAIL_SMTP,
      secureConnection: true,
      port: 465,
      auth: {user: MAIL_USER,pass: MAIL_PASS},
    });

    const send = async (to, subject, html) => {
      try {
        transporter.sendMail({
          from: MAIL_USER, to, subject, html
        }); 
      } catch(error) {
        console.log(error)
      }
    }

    if(Array.isArray(to)) {
      let timeout = 2000;
        to.forEach(email => {
          (email)
          setTimeout(() => {
            send(email, subject, html)
          timeout += 5000;
        }, timeout);
      })
    } else {
      return await transporter.sendMail({
        from: MAIL_USER, to, subject, html
      }); 
    }
  }
}

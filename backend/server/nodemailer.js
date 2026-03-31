const { text } = require("express");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

const mailOptions = {
  from: `<${process.env.EMAIL_USER}>`,
  to: "{valami}@gmail.com",
  subject: "OAuth test",
  text: "Siker",
  html: "<h1>Siker</h1>",
};

transporter.sendMail(
  {
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "Test message",
    text: "I hope this message gets delivered!",
  },
  (err, info) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(info.envelope);
    console.log(info.messageId);
  },
);

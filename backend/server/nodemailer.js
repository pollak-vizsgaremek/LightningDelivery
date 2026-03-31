import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
port: 465,               // true for 465, false for other ports
host: "smtp.gmail.com",
   auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
     },
secure: true,
});

function emailSend(email) {
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
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
}

export default emailSend;

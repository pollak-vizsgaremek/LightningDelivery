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

function emailSend(email, link) {
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Test message",
      text: `A jelszó helyreállítási link: ${link}`
      ,
    },
    (err, info) => {
      if (err) {
        console.error(err);
        return;
      }
    },
  );
}

export default emailSend;
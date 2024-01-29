import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let sendMail = (mailOption) => {
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      return console.log(error);
    }
    return info;
  });
};

export default sendMail;

import nodemailer from "nodemailer";

const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "b7mfbjywo2ei4n6d@ethereal.email",
      pass: "mEnfk9KYDQzXf9CUzm",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: "Luquinhas 🤠 <luquinhas@lucasverso.com>",
    to: to,
    subject: "Mudança de Senha",
    html: html,
  });

  console.log("Mensagem enviada: ", info.messageId);

  console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;

import Mailgen from "mailgen";
import nodeMailer from "nodemailer";

const sendMail = async(options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Homely Hub",
      link: "https://homelyhub.vercel.com",
    },
  });

  const emailBody = mailGenerator.generate(options.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  // Nodemailer Starts
  const transporter = nodeMailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth:{
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "<hello@homelyhub.in>",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailBody
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email Failed",error);
  }
};

// Factory function 
const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
        name: username,
        intro: "Welcome to Homely Hub Website! We\'re very excited to have you on board.Let's reset your password",
        action: {
            instructions: 'To Reset your password, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Reset your password',
                link: passwordResetUrl,
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };
};

export {sendMail, forgotPasswordMailGenContent};
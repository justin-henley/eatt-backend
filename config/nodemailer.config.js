// Libraries
const nodemailer = require('nodemailer');

// Transport allows sending emails
const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PWD,
  },
});

// TODO Should the link just point to the backend with a redirect link?
// TODO Decorate the email a little more
module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  /* console.log(`sending confirmation email`); */
  transport
    .sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Please confirm your account',
      html: `<div>
            <h1>Email Confirmation</h1>
            <h2>Hello, ${name}</h2>
            <p>Thank you for signing up to Eatt. Please confirm your email by clicking on the link below, or pasting it into your browser's address bar.</p>
            <a href=${process.env.FRONTEND_URL}/register/${confirmationCode}>Click here to confirm your email address</a>
            </div>
        `,
    })
    .catch((err) => console.log(err));
};

// Password Reset Email
module.exports.sendPasswordResetEmail = (name, email, resetToken) => {
  console.log(`sending password reset email to ${name}: ${email}`);
  transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Link',
    html: `
      <div>
      <h1>Hello, ${name}.</h1>
      <br />
      <a href=${process.env.FRONTEND_URL}/reset/${resetToken}>Click here to reset your password.</a>
      <br />
      <p>If you did not request a password reset, please <a href='mailto: ${process.env.EMAIL_USER}'>reach out.</a> 
      </div>`,
  });
};
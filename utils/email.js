const nodemailer = require('nodemailer');
const jade = require('jade');
const htmlToText = require('html-to-text');
const sendgridTransport = require('nodemailer-sendgrid-transport');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`

    // console.log('IN SENDMAIL constructor!!!');
  }

  newTransport() {
    // console.log('IN SENDMAIL newTransport!!!');
    if (process.env.NODE_ENV === 'production') {
      // use SendGrid
      const transporter = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_user: process.env.SENDGRID_API_USER,    // SG username
            api_key: process.env.SENDGRID_API_PASSWORD, // SG password
          },
        })
      );

      return transporter;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    return transporter;
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a jade template
    const html = jade.renderFile(`${__dirname}/../views/email/${template}.jade`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    // console.log('READY TO SEND MAIL NOW!!!');
    // 3) create a transport and send email
    await this.newTransport().sendMail(mailOptions, err => {
      console.error('ERROR WHILE SENDING MAIL: ', err);
    });
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    // console.log('READY TO SEND MAIL NOW IN sendPasswordReset!!!');
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
}

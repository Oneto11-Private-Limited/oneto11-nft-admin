const nodemailer = require('nodemailer');


// setup a transport for sending email
const transporter = nodemailer.createTransport({
  host: "mail.24livehost.com",
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "wwwsmtp@24livehost.com", // generated ethereal user
    pass: "dsmtp909#" // generated ethereal password
  }
});


exports.getEmailTemplate = (templateName) => {
  const emailTemplateModel = require("../plugins/email-templates/models/email_templates/emailTemplatesSchema");
  return new Promise((resolve, reject) => {
    emailTemplateModel.findOne({ name: templateName, status: true }, ['name', 'subject', 'type', 'content'], (err, result) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

exports.sendMail = async (to, subject, body, bodyType) => {

  let emailObject = {
    from: 'support@wildearth.com',
    to: to,
    subject: subject
  }

  if (bodyType == 'text') {
    emailObject['text'] = body;
  } else {
    emailObject['html'] = body;
  }
  // send mail with defined transport object
  await transporter.sendMail(emailObject);
}
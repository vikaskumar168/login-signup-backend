const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    host:config.EMAIL_HOST,
    port:config.EMAIL_PORT,
    secure:false,
    auth:{
        user:config.EMAIL_USER,
        pass:config.EMAIL_PASS
        }
});

async function sendOtpEmail(to, otp){
    const mail = {
        from:config.EMAIL_USER,
        to,
        subject:'Your email verification OTP',
        text:`Your OTP is ${otp}. It is valid for ${config.OTP_EXPIRATION_TIME} minutes.`
    };
    return transporter.sendMail(mail);
}

module.exports = {
    sendOtpEmail
};
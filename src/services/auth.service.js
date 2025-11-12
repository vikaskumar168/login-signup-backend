const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const config = require('../config');
const {sendOtpEmail} = require('./email.service');


function generateOtpValue(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function signup(payload){
    const existingUser = await User.findOne({email:payload.email});
    if(existingUser){
        throw new Error('User with this email already exists');
    }

    payload.password = await hashPassword(payload.password);
    const user = await User.create(payload);
    
    const otpValue = generateOtpValue();
    const expiresAt = new Date(Date.now() + config.OTP_EXPIRATION_MINUTES * 60000);
    await OTP.create({userId:user._id, otp:otpValue, expertiseAt:expiresAt});
    await sendOtpEmail(user.email, otpValue);

    return user;
}


async function verifyEmail(userId, otpValue) {
  const record = await Otp.findOne({ userId, otp: otpValue });
  if (!record) throw new Error('Invalid OTP');
  if (record.expiresAt < new Date()) throw new Error('OTP expired');

  await User.findByIdAndUpdate(userId, { isEmailVerified: true });
  await Otp.deleteMany({ userId });
  return true;
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  if (!user.isEmailVerified) {
    // create OTP for verification and return flag
    const otpValue = generateOtpValue();
    const expiresAt = new Date(Date.now() + config.OTP_EXPIRATION_MINUTES * 60 * 1000);
    await Otp.create({ userId: user._id, otp: otpValue, expiresAt });
    await sendOtpEmail(user.email, otpValue);
    return { needsVerification: true, userId: user._id };
  }

  const token = generateToken({ sub: user._id, email: user.email });
  return { token, user };
}

module.exports = { signup, verifyEmail, login };
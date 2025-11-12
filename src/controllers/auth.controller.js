const authService = require('../services/auth.service');

async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ message: 'Signup successful. OTP sent to email.', user: { id: result.user._id, email: result.user.email } });
  } catch (err) { next(err); }
}

async function verifyEmail(req, res, next) {
  try {
    const { userId, otp } = req.body;
    await authService.verifyEmail(userId, otp);
    res.json({ message: 'Email verified' });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (result.needsVerification) return res.status(403).json({ message: 'Email not verified. OTP sent.', userId: result.userId });
    res.json({ token: result.token, user: result.user });
  } catch (err) { next(err); }
}

module.exports = { signup, verifyEmail, login };
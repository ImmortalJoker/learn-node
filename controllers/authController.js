const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const crypto = require('crypto');
const mail = require('../handlers/mail');
const urls = require('../routes/constants');

exports.login = passport.authenticate('local', {
  failureRedirect: urls.LOGIN_PAGE_URL(),
  failureFlash: 'Failed Login!',
  successRedirect: urls.HOME_PAGE_URL(),
  successFlash: 'You now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect(urls.HOME_PAGE_URL());
};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();

    return;
  }

  req.flash('error', 'Oops you must be logged in');
  res.redirect(urls.LOGIN_PAGE_URL())
};

exports.forgot = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});

  if(!user) {
    req.flash('error', 'No account with that email exists.');

    res.redirect(urls.LOGIN_PAGE_URL());
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpire = Date.now() + 3600000;

  await user.save();

  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

  await mail.send({
    filename: 'password-reset',
    user,
    subject: 'Password reset',
    resetURL
  });

  req.flash('success', `You have been emailed a password reset link.`);

  res.redirect(urls.LOGIN_PAGE_URL());
};

exports.findUserByToken = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpire: {$gt: Date.now()}
  });

  if(!user) {
    req.flash('error', 'Password reset is invalid or has expired');

    return res.redirect(urls.LOGIN_PAGE_URL());
  }

  req.userReset = user;

  next();
};

exports.reset = async (req, res) => {
  res.render('reset', {title: 'Reset your Password'});
};

exports.confirmedPasswords = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    next();

    return;
  }

  req.flash('error', 'Password do not match!');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const user = req.userReset;
  const setPassword = promisify(user.setPassword, user);

  await setPassword(req.body.password);

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  const updatedUser = await user.save();

  await req.login(updatedUser);

  req.flash('success', 'Your password has been reset! You are now logged in!');

  res.redirect(urls.HOME_PAGE_URL);
};

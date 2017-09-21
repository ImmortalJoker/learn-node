const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const urls = require('../routes/constants');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'})
};

exports.registerForm = (req, res) => {
  res.render('register', {title: 'Register'})
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops! Your password do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});

    return;
  }

  next();
};

exports.register = async (req, res, next) => {
  const {email, name, password} = req.body;

  const user = new User({
    email,
    name
  });
  const register = promisify(User.register, User);

  await register(user, password);

  next();
};

exports.account = (req, res) => {
  res.render('account', {title: 'Edit Your Account'})
};

exports.updateAccount = async (req, res) => {
  const {email, name} = req.body;

  const updates = {
    email,
    name
  };

  const user = await User.findOneAndUpdate(
    {_id: req.user._id},
    {$set: updates},
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );

  req.flash('success', 'Updated the profile!');
  res.redirect(urls.ACCOUNT_PAGE_URL());
};

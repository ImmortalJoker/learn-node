const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const urls = require('../routes/constants');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');

    if (isPhoto) {
      next(null, true);
    } else {
      next({message: 'That filetype isn\'t allowed!'}, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add store'})
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware

    return;
  }

  const extension = req.file.mimetype.split('/')[1];

  req.body.photo = `${uuid.v4()}.${extension}`;

  // now we resize
  const photo = await jimp.read(req.file.buffer);

  await photo.resize(800, jimp.AUTO);
  await photo.write(urls.PUBLIC_UPLOADS_RESOURCES_URL(req.body.photo));

  //once we have written the photo to our filesystem, keep going!
  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save();

  req.flash('success', `Successfully created <strong>${store.name}</strong>. Care to leave a review?`);

  res.redirect(urls.STORE_URL(store.slug));
};

exports.getStores = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;
  const storesPromise = Store
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc'});
  const countPromise = Store.count();

  const [stores, count] = await Promise.all([storesPromise, countPromise]);
  const pages = Math.ceil(count / limit);

  if (!stores.length && skip) {
    req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put  you on page ${pages}`);
    res.redirect(urls.STORES_BY_PAGE_URL(pages));

    return;
  }

  res.render('stores', {title: 'Stores', stores, page, pages, count})
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug})
    .populate('author reviews');

  if (!store) return next();

  res.render('storePage', {store})
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it!')
  }
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id});

  confirmOwner(store, req.user);

  res.render('editStore', {title: `Edit ${store.name}`, store})
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
    runValidators: true
  }).exec();

  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href=${urls.STORE_URL(store.slug)}>View store</a>`);

  res.redirect(urls.STORE_EDIT_URL(store._id));
};

exports.getStoresByTag = async (req, res) => {
  const currentTag = req.params.tag;
  const tagQuery = currentTag || {$exists: true};

  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({tags: tagQuery});

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

  res.render('tags', {title: 'Tags', tags, stores, currentTag});
};

exports.searchStores = async (req, res) => {
  const stores = await Store.find({
      $text: {
        $search: req.query.q,
      }
    }, {
      score: {$meta: 'textScore'}
    })
    .sort({
      score: {$meta: 'textScore'}
    })
    .limit(5);

  res.json(stores);
};

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000
      }
    }
  };
  const stores = await Store.find(q).select('slug name description location photo').limit(10);

  res.json(stores);
};

exports.mapPage = (req, res) => {
  res.render('map', {title: 'Map'})
};

exports.favoriteStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());
  const operator = hearts.includes(req.params.id) ? '$pull': '$addToSet';
  const user = await User.findOneAndUpdate(req.user._id,
    {[operator]: {hearts: req.params.id}},
    {new: true}
    );

  res.json(user);
};

exports.favoriteStores = async (req, res) => {
  const stores = await Store.find({
    _id: {$in: req.user.hearts}
  });

  res.render('stores', {title: 'Favorite Stores', stores})
};

exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();

  res.render('topStores', {title: 'Top Stores!', stores})
};
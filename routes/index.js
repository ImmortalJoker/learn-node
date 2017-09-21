const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const {catchErrors} = require('../handlers/errorHandlers');
const urls = require('./constants');

// Do work here
router.get(urls.HOME_PAGE_URL(), catchErrors(storeController.getStores));
router.get(urls.STORE_ADD_NEW_URL(),
  authController.isLoggedIn,
  storeController.addStore
);

router.post(urls.STORE_UPDATE_URL(':id'),
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.post(urls.STORE_ADD_NEW_URL(),
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.get(urls.STORES_URL(), catchErrors(storeController.getStores));
router.get(urls.STORES_BY_PAGE_URL(':page'), catchErrors(storeController.getStores));
router.get(urls.STORE_EDIT_URL(':id'), catchErrors(storeController.editStore));
router.get(urls.STORE_URL(':slug'), catchErrors(storeController.getStoreBySlug));
router.get(urls.FAVORITE_STORES_URL(),
  authController.isLoggedIn,
  catchErrors(storeController.favoriteStores)
);

router.get(urls.TAGS_URL(), catchErrors(storeController.getStoresByTag));
router.get(urls.TAG_URL(':tag'), catchErrors(storeController.getStoresByTag));

router.get(urls.LOGIN_PAGE_URL(), userController.loginForm);
router.post(urls.LOGIN_PAGE_URL(), authController.login);
router.get(urls.LOGOUT_PAGE_URL(), authController.logout);
router.get(urls.REGISTER_PAGE_URL(), userController.registerForm);
router.post(urls.REGISTER_PAGE_URL(),
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get(urls.ACCOUNT_PAGE_URL(),
  authController.isLoggedIn,
  userController.account
);

router.post(urls.ACCOUNT_PAGE_URL(), catchErrors(userController.updateAccount));
router.post(urls.FORGOT_URL(), catchErrors(authController.forgot));
router.get(urls.RESET_URL(':token'),
  catchErrors(authController.findUserByToken),
  authController.reset
);
router.post(urls.RESET_URL(':token'),
  authController.confirmedPasswords,
  catchErrors(authController.findUserByToken),
  authController.update
);
router.get(urls.MAP_LOCATION_URL(), storeController.mapPage);
router.post(urls.REVIEW_STORE_URL(':id'),
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
);
router.get(urls.TOP_REVIEWS_URL(), catchErrors(storeController.getTopStores));
/*
  API
*/

router.get(urls.API_SEARCH_URL(), catchErrors(storeController.searchStores));
router.get(urls.API_STORES_NEAR_URL(), catchErrors(storeController.mapStores));
router.post(urls.API_FAVORITE_STORE_URL(':id'), catchErrors(storeController.favoriteStore));

module.exports = router;

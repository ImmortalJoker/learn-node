const h = require('../url-helper');

module.exports = {
  HOME_PAGE_URL: h.urlWithDelimiter.bind(null, '/'),
  //Login
  LOGIN_PAGE_URL: h.urlWithDelimiter.bind(null, '/login'),
  REGISTER_PAGE_URL: h.urlWithDelimiter.bind(null, '/register'),
  LOGOUT_PAGE_URL: h.urlWithDelimiter.bind(null, '/logout'),
  //Add Store
  STORE_ADD_NEW_URL: h.urlWithDelimiter.bind(null, '/add'),
  STORE_UPDATE_URL: h.urlWithDelimiter.bind(null, '/add/${id}'),
  //Account
  ACCOUNT_PAGE_URL: h.urlWithDelimiter.bind(null, '/account'),
  FORGOT_URL: h.urlWithDelimiter.bind(null, '/account/forgot'),
  RESET_URL: h.urlWithDelimiter.bind(null, '/account/reset/${token}'),
  //Store
  STORES_URL: h.urlWithDelimiter.bind(null, '/stores'),
  STORES_BY_PAGE_URL: h.urlWithDelimiter.bind(null, '/stores/page/${page}'),
  STORE_EDIT_URL: h.urlWithDelimiter.bind(null, '/stores/${id}/edit'),
  STORE_URL: h.urlWithDelimiter.bind(null, '/stores/${slug}'),
  FAVORITE_STORES_URL: h.urlWithDelimiter.bind(null, '/favorite'),
  //Reviews
  REVIEW_STORE_URL: h.urlWithDelimiter.bind(null, '/reviews/${id}'),
  TOP_REVIEWS_URL: h.urlWithDelimiter.bind(null, '/top'),
  //Tag
  TAGS_URL: h.urlWithDelimiter.bind(null, '/tags'),
  TAG_URL: h.urlWithDelimiter.bind(null, '/tags/${tag}'),
  //Map
  MAP_LOCATION_URL: h.urlWithDelimiter.bind(null, '/map'),
  //Public
  UPLOADS_RESOURCES_URL: h.urlWithDelimiter.bind(null, '/uploads/${fileName}'),
  PUBLIC_UPLOADS_RESOURCES_URL: h.urlWithDelimiter.bind(null, 'public/uploads/${fileName}'),
  //Api
  API_SEARCH_URL: h.urlWithDelimiter.bind(null, '/api/search'),
  API_SEARCH_WITH_QUERY_URL: h.urlWithDelimiter.bind(null, '/api/search?q=${query}'),
  API_STORES_NEAR_URL: h.urlWithDelimiter.bind(null, '/api/stores/near'),
  API_STORES_NEAR_WITH_QUERY_URL: h.urlWithDelimiter.bind(null, '/api/stores/near?lat=${lat}&lng=${lng}'),
  API_FAVORITE_STORE_URL: h.urlWithDelimiter.bind(null, '/api/stores/${id}/heart')
};
const {
  getAll,
  create,
  getOne,
  remove,
  update,
  verifyEmail,
  login,
  logged,
  verifyReset,
  resetPassword,
} = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const routerUser = express.Router();

routerUser.route('/reset_password').post(verifyReset);
routerUser.route('/').get(verifyJWT, getAll).post(create);
routerUser.route('/me').get(verifyJWT, logged);

routerUser.route('/login').post(login);

routerUser
  .route('/:id')
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

routerUser.route('/verify/:code').get(verifyEmail);
routerUser.route('/reset_password/:code').post(resetPassword);

module.exports = routerUser;

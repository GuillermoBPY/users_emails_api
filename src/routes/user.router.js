//-----------Controllers-----------
const {
  getAllUsers,
  createUser,
  loggedUser,
  loginUser,
  getOneUser,
  removeUser,
  updateUser,
  verifiyUserEmail,
  resetUserPass,
  verifyUserPassReset,
} = require('../controllers/user.controllers');
//-----------Librerias-----------
const express = require('express');
const routerUser = express.Router(); //Instancia de libreria
//-----------Utilidades-----------
const verifyJWT = require('../utils/verifyJWT');
//-----------Statics Routes-----------
routerUser.route('/').get(verifyJWT, getAllUsers).post(createUser);
routerUser.route('/me').get(verifyJWT, loggedUser);
routerUser.route('/login').post(loginUser);
routerUser.route('/reset_password').post(verifyUserPassReset);
//-----------Dinamics Routes-----------
routerUser
  .route('/:id')
  .get(verifyJWT, getOneUser)
  .delete(verifyJWT, removeUser)
  .put(verifyJWT, updateUser);

routerUser.route('/verify/:code').get(verifiyUserEmail);

routerUser.route('/reset_password/:code').post(resetUserPass);

module.exports = routerUser;

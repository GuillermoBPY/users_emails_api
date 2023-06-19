//-----------Models-----------
const User = require('../models/User');
const EmailCode = require('../models/EmailCode');
//-----------Librerias-----------
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//-----------Utilidades-----------
const sendEmail = require('../utils/sendEmail');
const catchError = require('../utils/catchError');
const validationMessage = require('../utils/validationMessage');
const resetPassMessage = require('../utils/resetPassMessage');
//-----------Controllers-----------

const getAllUsers = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const createUser = catchError(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    country,
    image,
    frontBaseUrl = 'http://localhost:8080/#',
  } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);
  const body = {
    email,
    password: hashpassword,
    firstName,
    lastName,
    country,
    image,
  };
  const result = await User.create(body);
  const code = require('crypto').randomBytes(64).toString('hex');
  const url = `${frontBaseUrl}/verify_email/${code}`;
  await sendEmail({
    to: `${email}`,
    subject: 'Email Validation',
    html: validationMessage(url),
  });
  const bodyCode = {
    code,
    userId: result.id,
  };
  await EmailCode.create(bodyCode);
  return res.status(201).json(result);
});

const getOneUser = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const removeUser = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const updateUser = catchError(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, country, image } = req.body;
  const bodyUpdated = { firstName, lastName, country, image };
  const result = await User.update(bodyUpdated, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const verifiyUserEmail = catchError(async (req, res) => {
  const { code } = req.params;
  const codeUser = await EmailCode.findOne({ where: { code } });
  if (!codeUser)
    return res.sendStatus(401).json({ message: 'Invalid Cretential' });
  const body = { isVerified: true };
  const userUpdate = await User.update(body, {
    where: { id: codeUser.userId },
    returning: true,
  });
  await codeUser.destroy();
  return res.json(userUpdate[1][0]);
});

const loginUser = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid Cretential' });
  if (!user.isVerified)
    return res.status(401).json({ message: 'Account Not Verified' });
  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass)
    return res.status(401).json({ message: 'Invalid Cretential' });
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return res.json({ user, token });
});

const loggedUser = catchError(async (req, res) => {
  const user = req.user;
  return res.json(user);
});

const verifyUserPassReset = catchError(async (req, res) => {
  const { email, frontBaseUrl = 'http://localhost:8080/#' } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid Cretential' });
  const existCode = await EmailCode.findOne({ where: { userId: user.id } }); //Busca si ya existe un codigo anterior para ese id, si existe lo elimina.
  if (existCode) existCode.destroy();
  const code = require('crypto').randomBytes(64).toString('hex');
  const url = `${frontBaseUrl}/reset_password/${code}`;
  await sendEmail({
    to: `${email}`,
    subject: 'Password Reset',
    html: resetPassMessage(url),
  });
  const bodyCode = {
    code,
    userId: user.id,
  };
  await EmailCode.create(bodyCode);
  return res.status(201).json({ message: 'Email sended', email }); //Se retorna email para uso del Frontend en la nofificación emergente.
});

const resetUserPass = catchError(async (req, res) => {
  const { password } = req.body;
  const { code } = req.params;
  const codeUser = await EmailCode.findOne({ where: { code } });
  console.log(`xxxxxxxxxxxxxxx${codeUser}`);
  if (!codeUser)
    return res.sendStatus(401).json({ message: 'Invalid Cretential' });
  const hashpassword = await bcrypt.hash(password, 10);
  const body = { password: hashpassword };
  const userUpdate = await User.update(body, {
    where: { id: codeUser.userId },
  });
  if (userUpdate[0] === 0) return res.sendStatus(404);
  await codeUser.destroy();
  return res.json({ message: 'User Updated' });
});

module.exports = {
  getAllUsers,
  createUser,
  getOneUser,
  removeUser,
  updateUser,
  verifiyUserEmail,
  loginUser,
  loggedUser,
  verifyUserPassReset,
  resetUserPass,
};

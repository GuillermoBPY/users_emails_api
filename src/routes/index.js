const express = require('express');
const routerUser = require('./user.router');
const router = express.Router();

//-----------Users Route-----------

router.use('/users', routerUser);

module.exports = router;

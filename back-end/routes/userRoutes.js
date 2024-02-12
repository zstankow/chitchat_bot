const express = require('express');
const router = express.Router();
const { validateData, validateJWT } = require('../middleware/authMiddleware');
const { signup, login, update, getUserInfos } = require('../controller/usersController');

router.post('/signup', validateData, signup);
router.post('/login', login);

router.put('/user/:id',validateJWT, update);
router.get('/user/:id',validateJWT, getUserInfos);

module.exports = router;
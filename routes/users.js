const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/user');
const { validationUpdateUser } = require('../utils/validations');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateProfile);

module.exports = router;
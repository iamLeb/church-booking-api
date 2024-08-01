const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const { AuthValidation } = require('../middlewares/AuthValidation');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/check', AuthValidation, AuthController.check);

module.exports = router;
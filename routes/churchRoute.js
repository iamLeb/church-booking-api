const router = require('express').Router();
const ChurchController = require('../controllers/ChurchController');

router.get('/', ChurchController.getAll);

module.exports = router;
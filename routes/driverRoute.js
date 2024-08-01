const router = require('express').Router();
const DriverController = require("../controllers/DriverController");

router.get('/:id', DriverController.getDriversInfo);

module.exports = router;
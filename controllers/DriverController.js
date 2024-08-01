const Service = require("../helpers/Service");
const User = require("../models/User");
const validation = require('../middlewares/validation');


const getDriversInfo = async (req, res, next) => {
    try {
        const service = new Service();
        await service.checkId(req.params.id);
        const driver = await service.getByField(User, '_id', req.params.id);
        return res.status(200).json(driver);
    } catch (e) {
        next(e);
    }
}

const accept = async (req, res, next) => {

}

module.exports = {
    getDriversInfo
}
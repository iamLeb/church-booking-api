const Service = require("../helpers/Service");
const User = require("../models/User");

const getAll = async (req, res, next) => {
    try {
        const service = new Service();

        const churches = await service.get(User, { type: 'church'});
        return res.json(churches);
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getAll
}
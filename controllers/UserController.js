const User = require('../models/User');
const Service = require("../helpers/Service");
const {Driver} = require("../models");

const getUsers = async (req, res, next) => {
    try {
        const service = new Service();
        const users = await service.get(User);
        return res.status(200).json(users);
    } catch (e) {
        next(e)
    }
}


module.exports = {
    getUsers
}
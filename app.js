// app.js

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./configs/database');
const { authRoute, driverRoute } = require('./routes/Index');
const errorHandler = require('./middlewares/errorHandler');

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
        this.start();
    }

    middlewares() {
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors({
            origin: process.env.ORIGINS,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true,
        }));
    }

    routes() {
        // ping server
        this.app.get('/ping', (req, res) => res.status(200).json('Server is Running'));
        this.app.use('/auth', authRoute);
        this.app.use('/driver', driverRoute);

        // Use error handling middleware
        this.app.use(errorHandler);
    }

    start() {
        this.app.listen(this.port, () => console.log(`Listening on port ${this.port}`));
    }
}

new App();

const mongoose = require('mongoose');

mongoose.connect(process.env.DB)
    .then(res => console.log('Database Connected'))
    .catch(err => console.log('There was an error connecting to the database.'));

const mongoose = require('mongoose');

const history= mongoose.Schema({
    user : String,
    message: String,
    date: String,
    time: String,
    room: String
})

module.exports = mongoose.model('history', history);
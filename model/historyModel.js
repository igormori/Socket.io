const mongoose = require('mongoose');

const history = mongoose.Schema({
    user : String,
    date: String,
    time: String,
    room: String,
    connected: Boolean 
})

module.exports = mongoose.model('history', history);
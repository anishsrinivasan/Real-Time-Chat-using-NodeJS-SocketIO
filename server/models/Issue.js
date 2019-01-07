

const mongoose = require('mongoose')
var Issue  = new mongoose.Schema({
    senderId:String,
    msg:String,
    timestamp:Object,
    avatarId:String
});

module.exports = mongoose.model('Issue', Issue);



import mongoose from 'mongoose';
var Issue  = new mongoose.Schema({
    filename:String,
    path:String,
    timestamp:Object
});

module.exports = mongoose.model('Issue', Issue);

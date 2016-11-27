var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  name: String,
  chat: Array
})

module.exports = mongoose.model('Chat', ChatSchema);

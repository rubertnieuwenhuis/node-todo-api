const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rubert:martijn@ds125938.mlab.com:25938/todoapp', () => {
  console.log('connected to database');
});

module.exports = { mongoose };
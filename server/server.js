const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://rubert:martijn@ds125938.mlab.com:25938/todoapp', () => {
  console.log('connected to database');
});

const Todo = mongoose.model('todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

const todo = new Todo({text: "some other text", completed: false, completedAt: 123});
todo.save()
  .then(() => {
    console.log('successfully saved to database');
  })
  .catch(e => {
    console.log(e);
});

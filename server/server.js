const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({hi: 'there'});
})

app.post('/todos', (req,res) => {
  const todo = new Todo({text: req.body.text});
  todo.save().then(todo => {
    console.log('todo: ', todo);
    res.send(todo);
  }, e => {
    res.status(400).send(e);
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos})
  }, e => {
    res.status(400).send(e);
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000');
})


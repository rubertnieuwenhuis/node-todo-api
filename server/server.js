const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;
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

app.get('/todos/:id', (req,res) => {
  const id = req.params.id
  
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  } 
  
  Todo.findById(id).then(todo => {
    if(!todo){
      return res.status(404).send('no todo found');
    }
    
    res.send({todo});
    
  }).catch(e => res.status(400).send(e));
  
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  }
  
  Todo.findByIdAndRemove(id).then(todo => {
    if(!todo) {
      return res.status(404).send('not found or removed');
    }
    
    res.send(todo);
    
  }).catch(e => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  }
  
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
    if(!todo){
      return res.status(404).send('not found or updated');
    }
    
    res.send({todo});
    
  }).catch((e) => {
   res.status(400).send(); 
  })
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})


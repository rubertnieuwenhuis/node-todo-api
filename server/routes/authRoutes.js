const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('../db/mongoose');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

module.exports = (app) => {
  
  app.post('/todos', authenticate, (req,res) => {
  const todo = new Todo({text: req.body.text, _creator: req.user._id});
  todo.save().then(todo => {
    res.send(todo);
  }, e => {
    res.status(400).send(e);
  })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then(todos => {
    res.send({todos});
  }, e => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', authenticate, (req,res) => {
  const id = req.params.id;
  
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  } 
  
  Todo.findOne({
    _id: id, 
    _creator: req.user._id
  }).then(todo => {
    if(!todo){
      return res.status(404).send('no todo found');
    }
    
    res.send({todo});
    
  }).catch(e => res.status(400).send(e));
  
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID not valid');
  }
  
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    if(!todo) {
      return res.status(404).send('not found or removed');
    }
    
    res.send(todo);
    
  }).catch(e => {
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
  
  Todo.findOneAndUpdate({
    _id: id, 
    _creator: req.user._id
  }, {$set: body}, {new: true}).then(todo => {
    if(!todo){
      return res.status(404).send('not found or updated');
    }
    
    res.send({todo});
    
  }).catch((e) => {
   res.status(400).send(); 
  })
  
});

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
   
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch(e => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.render('me', {user: req.user})
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  
  User.findByCredentials(body.email, body.password).then(user => {
     return user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user);  
    })
  }). catch(e => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch(e => {
    res.status(400).send();
  })
})

  
};
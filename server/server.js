const express = require('express');
const bodyParser = require('body-parser');
// const { ObjectID } = require('mongodb');
// const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

require('./routes/authRoutes')(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
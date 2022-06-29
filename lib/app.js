const cookieParser = require('cookie-parser');
const express = require('express');
const authenticate = require('./middleware/authenticate');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'https://luxury-travesseiro-6d7b8e.netlify.app',
      'https://backend-todo-listerino.herokuapp.com',
      'http://127.0.0.1:7891',
      'http://localhost:7891',
    ],
    credentials: true,
  })
);
// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/todo', authenticate, require('./controllers/todo'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

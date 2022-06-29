const { Router } = require('express');
const authorizeTodo = require('../middleware/authorizeTodo');
const Todo = require('../models/Todo');

module.exports = Router()
  .put('/:id', authorizeTodo, async (req, res, next) => {
    try {
      const todo = await Todo.updateById(req.params.id, req.body);
      res.json(todo);
    } catch (e) {
      next(e);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const resp = await Todo.getAllByUserId(req.user.id);
      res.json(resp);
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const resp = await Todo.insert({ ...req.body, user_id: req.user.id });
      res.json(resp);
    } catch (e) {
      next(e);
    }
  });

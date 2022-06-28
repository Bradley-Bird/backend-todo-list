const { Router } = require('express');
const Todo = require('../models/Todo');

module.exports = Router()
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

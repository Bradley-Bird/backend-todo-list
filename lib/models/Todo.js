const todo = require('../controllers/todo');
const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  todo;
  done;

  constructor(row) {
    this.id = row.id;
    this.todo = row.todo;
    this.done = row.done;
    this.user_id = row.user_id;
  }

  static async insert({ todo, user_id }) {
    const { rows } = await pool.query(
      `
    INSERT INTO todo (todo, user_id)
    VALUES ($1, $2) RETURNING *`,
      [todo, user_id]
    );
    return new Todo(rows[0]);
  }
  static async getAllByUserId(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM todo WHERE user_id=$1
    `,
      [id]
    );
    const data = rows.map((row) => row);
    return data;
  }
  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM todo WHERE id = $1 RETURNING *',
      [id]
    );
    return new Todo(rows[0]);
  }

  static async updateById(id, attrs) {
    const todos = await Todo.getById(id);
    if (!todos) return null;
    const { todo, done } = { ...todos, ...attrs };
    const { rows } = await pool.query(
      `
    UPDATE todo
    SET todo=$2, done=$3
    WHERE id=$1 RETURNING *`,
      [id, todo, done]
    );
    return new Todo(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM todo
      WHERE id=$1
      `,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }
};

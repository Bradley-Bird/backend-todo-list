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
};

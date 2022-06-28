const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #password_hash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#password_hash = row.password_hash;
    this.user_id = row.user_id;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
    INSERT INTO todo_users (email, password_hash)
    VALUES($1, $2)
    RETURNING *`,
      [email, passwordHash]
    );
    return new User(rows[0]);
  }
  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM todo_users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }
};

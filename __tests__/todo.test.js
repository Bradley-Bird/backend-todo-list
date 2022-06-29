const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Todo = require('../lib/models/Todo');

const mockUser = {
  email: '14@14.com',
  password: '123123',
};
const mockUser2 = {
  email: '15@15.com',
  password: '123123',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todo routes', () => {
  beforeEach(() => {
    setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('Post to /api/v1/todo should create a new todo', async () => {
    const [agent, user] = await registerAndLogin();
    const resp = await agent.post('/api/v1/todo').send({
      todo: 'clean',
    });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      todo: 'clean',
      done: false,
    });
  });
  it('get returns a list of todos if id === user_id', async () => {
    const [agent, user] = await registerAndLogin();
    await agent.post('/api/v1/todo').send({
      todo: 'clean',
    });
    const resp = await agent.get('/api/v1/todo');
    expect(resp.body).toEqual([
      {
        id: expect.any(String),
        user_id: user.id,
        todo: 'clean',
        done: false,
      },
    ]);
  });
  it('Put, /api/v1/todo/:id should update an item', async () => {
    const [agent] = await registerAndLogin();
    const todo = await agent.post('/api/v1/todo').send({
      todo: 'clean',
    });
    const resp = await agent
      .put(`/api/v1/todo/${todo.body.id}`)
      .send({ done: true });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ ...todo.body, done: true });
  });
  it('PUT /api/v1/items/:id should 403 for invalid users', async () => {
    // create a user
    const [agent] = await registerAndLogin();
    // create a second user
    const user2 = await UserService.create(mockUser2);
    const item = await Todo.insert({
      todo: 'clean',
      user_id: user2.id,
    });
    const resp = await agent
      .put(`/api/v1/todo/${item.id}`)
      .send({ bought: true });
    expect(resp.status).toBe(403);
  });
  it('deletes todo item if user_id matches id', async () => {
    const [agent] = await registerAndLogin();
    const todo = await agent.post('/api/v1/todo').send({
      todo: 'clean',
    });
    const resp = await agent.delete(`/api/v1/todo/${todo.body.id}`);
    expect(resp.status).toBe(200);
  });
});

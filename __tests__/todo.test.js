const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: '14@14.com',
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
      done: false,
    });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      todo: 'clean',
      done: false,
    });
  });
});

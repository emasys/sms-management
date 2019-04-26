import Boom from 'boom';
import model from '../../sequelize/models';
import createUser from './user';
import {
  fetchUserMessages, sendMessage, fetchAllUserMessages, readMessage, deleteMessage,
} from './sms';

const scheme = () => ({
  api: {
    settings: {
      secured: true,
    },
  },
  authenticate(request, h) {
    const { phone } = request.headers;
    const credentials = {};
    if (!phone) {
      throw Boom.unauthorized(null, 'Custom');
    }
    // eslint-disable-next-line no-unused-expressions
    phone === process.env.ADMIN_PHONE_NUMBER
      ? (credentials.scope = 'admin')
      : (credentials.scope = 'user');
    credentials.phoneNumber = phone;
    return h.authenticated({ credentials });
  },
});

const controllerPlugin = {
  name: 'controller',
  register: (server) => {
    server.bind({ model });
    server.auth.scheme('custom', scheme);
    server.auth.strategy('default', 'custom');
    server.auth.default('default');
    server.route(createUser);
    server.route(fetchUserMessages);
    server.route(fetchAllUserMessages);
    server.route(sendMessage);
    server.route(readMessage);
    server.route(deleteMessage);
  },
};

export default controllerPlugin;

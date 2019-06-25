import Boom from 'boom';
import model from '../../sequelize/models';
import createUser from './user';
import {
  fetchUserInbox,
  sendMessage,
  viewMessage,
  fetchUserOutbox,
  deleteInbox,
  deleteOutbox,
} from './sms';

export const notFound = {
  path: '/{any*}',
  method: '*',
  handler(request, h) {
    return h.response({
      message: 'visit our docs at /documentation to view all routes',
      status: 'Not found',
    }).code(404);
  },
};

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
    server.route(fetchUserInbox);
    server.route(fetchUserOutbox);
    server.route(sendMessage);
    server.route(viewMessage);
    server.route(deleteInbox);
    server.route(deleteOutbox);
    server.route(notFound);
  },
};

export default controllerPlugin;

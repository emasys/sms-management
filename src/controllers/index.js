import model from '../../sequelize/models';
import { signIn, createUser, changePin } from './user';
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
    return h
      .response({
        message: 'visit our docs at /documentation to view all routes',
        status: 'Not found',
      })
      .code(404);
  },
};

const controllerPlugin = {
  name: 'controller',
  register: (server) => {
    server.bind({ model });
    server.auth.strategy('jwt-strategy', 'hapi-now-auth', {
      verifyJWT: true,
      keychain: [process.env.SECRET],
      validate: async (request, token) => {
        const credentials = token.decodedJWT;
        // eslint-disable-next-line no-unused-expressions
        credentials.role === 'admin'
          ? credentials.scope = 'admin'
          : credentials.scope = 'user';
        return {
          isValid: true,
          credentials,
        };
      },
    });
    server.auth.default('jwt-strategy');
    server.route(createUser);
    server.route(signIn);
    server.route(changePin);
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

import model from '../sequelize/models';
import {
  signIn, createUser, changePin, deleteUser, changeRole,
} from './user';
import {
  fetchUserInbox,
  sendMessage,
  viewMessage,
  fetchUserOutbox,
  deleteInbox,
  deleteOutbox,
} from './sms';
import { notFound } from './misc';

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
          ? (credentials.scope = 'admin')
          : (credentials.scope = 'user');
        return {
          isValid: true,
          credentials,
        };
      },
    });
    server.auth.default('jwt-strategy');
    server.route(notFound);
    // eslint-disable-next-line no-param-reassign
    server.realm.modifiers.route.prefix = '/v1';
    server.route(createUser);
    server.route(signIn);
    server.route(changePin);
    server.route(changeRole);
    server.route(fetchUserInbox);
    server.route(fetchUserOutbox);
    server.route(sendMessage);
    server.route(viewMessage);
    server.route(deleteInbox);
    server.route(deleteOutbox);
    server.route(deleteUser);
  },
};

export default controllerPlugin;

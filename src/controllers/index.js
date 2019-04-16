import model from '../../sequelize/models';
import createUser from './user';

const controllerPlugin = {
  name: 'controller',
  register: (server) => {
    server.bind({ model });
    server.route(createUser);
  },
};

export default controllerPlugin;

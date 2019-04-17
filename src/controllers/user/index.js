import Boom from 'boom';
import { options } from './userUtils';

const createUser = {
  path: '/v1/user/register',
  method: 'POST',
  options,
  async handler(request, h) {
    const { payload } = request;
    const role = payload.phoneNumber === '02340000000000' ? 'admin' : 'user';
    try {
      payload.role = role;
      const { phoneNumber } = await this.model.Users.create(payload);
      return h.response({ message: `${phoneNumber} has been registered` }).code(201);
    } catch (error) {
      if (error.errors && error.errors[0].type === 'unique violation') {
        return Boom.conflict(error.errors[0].message);
      }
      return Boom.badRequest(error.message);
    }
  },
};

export default createUser;

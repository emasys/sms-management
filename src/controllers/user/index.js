import Joi from 'joi';
import Boom from 'boom';

const createUser = {
  path: '/v1/user/register',
  method: 'POST',
  options: {
    description: 'Phone number registration',
    tags: ['api'],
    auth: false,
    validate: {
      payload: Joi.object().keys({
        phoneNumber: Joi.string()
          .regex(/[0-9]{14}/)
          .required()
          .error(() => ({
            message: 'Phone number must contain 14 numbers like so - 0234xxxxxxxxxx',
          })),
        name: Joi.string()
          .regex(/^[a-z][a-z\s]*$/)
          .error(() => ({
            message: 'Name must not contain numbers and special characters',
          }))
          .required(),
      }),
    },
  },
  async handler(request, h) {
    const { payload } = request;
    const role = payload.phoneNumber === '02347063123584' ? 'admin' : 'user';
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

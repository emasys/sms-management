import Joi from 'joi';

// eslint-disable-next-line import/prefer-default-export
export const options = {
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
};

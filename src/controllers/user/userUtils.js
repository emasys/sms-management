import Joi from 'joi';
import jwt from 'jsonwebtoken';

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
      pin: Joi.string()
        .regex(/[0-9]{4}/)
        .error(() => ({
          message: 'Pin must be four digits',
        }))
        .required(),
    }),
  },
};

export const signinOptions = {
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
      pin: Joi.string()
        .length(4)
        .regex(/[0-9]{4}/)
        .error(() => ({
          message: 'Pin must be four digits',
        }))
        .required(),
    }),
  },
};

export const pinChangeOptions = {
  description: 'Change pin',
  tags: ['api'],
  auth: false,
  validate: {
    payload: Joi.object().keys({
      pin: Joi.string()
        .length(4)
        .regex(/[0-9]{4}/)
        .error(() => ({
          message: 'Pin must be four digits',
        }))
        .required(),
      newPin: Joi.string()
        .length(4)
        .regex(/[0-9]{4}/)
        .error(() => ({
          message: 'New pin must be four digits',
        }))
        .required(),
      puk: Joi.string().required(),
    }),
  },
};

export const deleteUserOptions = {
  description: 'Delete User',
  tags: ['api'],
  auth: {
    scope: ['admin'],
  },
  validate: {
    params: Joi.object().keys({
      userId: Joi.number().required(),
    }),
  },
};

export const signToken = (phoneNumber, role) => {
  const token = jwt.sign(
    {
      phoneNumber,
      role,
    },
    process.env.SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1d',
    },
  );
  return token;
};

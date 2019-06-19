import Joi from 'joi';

export const fetchOptions = {
  description: 'Fetch all user messages',
  tags: ['api'],
  auth: {
    scope: ['admin'],
  },
  validate: {
    headers: {
      phone: Joi.string().required(),
    },
    query: Joi.object().keys({
      limit: Joi.number().default(20),
      offset: Joi.number().default(0),
    }),
  },
};

export const fetchMessages = {
  description: 'Fetch user messages',
  tags: ['api'],
  auth: {
    scope: ['user', 'admin'],
  },
  validate: {
    query: Joi.object().keys({
      limit: Joi.number().default(20),
      offset: Joi.number().default(0),
    }),
  },
};

export const sendOptions = {
  description: 'Send a message',
  tags: ['api'],
  auth: {
    scope: ['admin', 'user'],
  },
  validate: {
    payload: Joi.object().keys({
      message: Joi.string()
        .trim()
        .required()
        .error(() => ({
          message: 'Message body is required.',
        })),
      phone: Joi.string()
        .required()
        .error(() => ({
          message: 'Provide phone number of the recipient',
        })),
    }),
  },
};

export const readOptions = {
  description: 'Read a message',
  tags: ['api'],
  auth: {
    scope: ['admin', 'user'],
  },
  validate: {
    params: Joi.object().keys({
      messageId: Joi.string()
        .trim()
        .required()
        .error(() => ({
          message: 'Message id is required.',
        })),
    }),
  },
};

export const deleteOptions = {
  description: 'Delete a message',
  tags: ['api'],
  auth: {
    scope: ['admin', 'user'],
  },
  validate: {
    params: Joi.object().keys({
      messageId: Joi.string()
        .trim()
        .required()
        .error(() => ({
          message: 'Message id is required.',
        })),
    }),
  },
};

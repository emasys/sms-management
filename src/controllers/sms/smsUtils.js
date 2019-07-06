import Joi from 'joi';
import SmsOps from './services';

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

const fetchMessages = {
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

export const fetchInbox = {
  description: 'Fetch user inbox',
  ...fetchMessages,
};

export const fetchOutbox = {
  description: 'Fetch user outbox',
  ...fetchMessages,
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

const accessSingleMessage = {
  tags: ['api'],
  auth: {
    scope: ['admin', 'user'],
  },
  validate: {
    params: Joi.object().keys({
      messageId: Joi.string()
        .trim()
        .required(),
    }),
  },
};

export const readOptions = {
  description: 'Read a message',
  ...accessSingleMessage,
};

export const deleteOptions = {
  description: 'Delete a message',
  ...accessSingleMessage,
};

export const fetchMessage = (request, h, type, model) => {
  const {
    query: { limit, offset },
    auth: {
      credentials: { phoneNumber },
    },
  } = request;
  const sms = new SmsOps(model, h);
  return sms.fetch(limit, offset, type, phoneNumber);
};

export const deleteMessage = (request, h, type, model) => {
  const {
    auth: {
      credentials: { phoneNumber },
    },
    params: { messageId },
  } = request;
  const sms = new SmsOps(model, h);
  return sms.deleteMessage(messageId, phoneNumber, type);
};

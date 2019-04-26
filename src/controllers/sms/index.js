import uuid from 'uuid/v4';
import {
  fetchOptions, sendOptions, fetchMessages, readOptions, deleteOptions,
} from './smsUtils';
import SmsOps from './services';

export const fetchAllUserMessages = {
  path: '/v1/users/messages',
  method: 'GET',
  options: fetchOptions,
  async handler(request, h) {
    const {
      params: { limit, offset },
    } = request;
    const sms = new SmsOps(this.model, h);
    return sms.fetch(limit, offset);
  },
};

export const fetchUserMessages = {
  path: '/v1/messages',
  method: 'GET',
  options: fetchMessages,
  async handler(request, h) {
    const {
      query: { limit, offset },
      auth: {
        credentials: { phoneNumber },
      },
    } = request;
    const sms = new SmsOps(this.model, h);
    return sms.fetch(limit, offset, phoneNumber);
  },
};

export const sendMessage = {
  path: '/v1/message',
  method: 'POST',
  options: sendOptions,
  async handler(request, h) {
    const {
      auth: {
        credentials: { phoneNumber },
      },
      payload: { message, phone },
    } = request;
    const id = uuid();
    const data = {
      message,
      recipient: `${phone}`,
      sender: phoneNumber,
      id,
    };
    const sms = new SmsOps(this.model, h);
    return sms.sendMessage(data);
  },
};

export const readMessage = {
  path: '/v1/message/{messageId}',
  method: 'GET',
  options: readOptions,
  async handler(request, h) {
    const {
      auth: {
        credentials: { phoneNumber },
      },
      params: { messageId },
    } = request;

    const sms = new SmsOps(this.model, h);
    return sms.readMessage(messageId, phoneNumber);
  },
};

export const deleteMessage = {
  path: '/v1/message/{messageId}',
  method: 'DELETE',
  options: deleteOptions,
  async handler(request, h) {
    const {
      auth: {
        credentials: { phoneNumber },
      },
      params: { messageId },
      query: { user },
    } = request;

    const sms = new SmsOps(this.model, h);
    return sms.deleteMessage(messageId, phoneNumber, user);
  },
};

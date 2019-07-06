import uuid from 'uuid/v4';
import {
  sendOptions,
  readOptions,
  deleteOptions,
  fetchOutbox,
  fetchInbox,
  deleteMessage,
  fetchMessage,
} from './smsUtils';
import SmsOps from './services';

export const fetchUserInbox = {
  path: '/inbox',
  method: 'GET',
  options: fetchInbox,
  async handler(request, h) {
    return fetchMessage(request, h, 'recipient', this.model);
  },
};

export const fetchUserOutbox = {
  path: '/outbox',
  method: 'GET',
  options: fetchOutbox,
  async handler(request, h) {
    return fetchMessage(request, h, 'sender', this.model);
  },
};

export const sendMessage = {
  path: '/message',
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

export const viewMessage = {
  path: '/message/{messageId}',
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
    return sms.accessMessage(messageId, phoneNumber);
  },
};

export const deleteInbox = {
  path: '/inbox/{messageId}',
  options: deleteOptions,
  method: 'DELETE',
  async handler(request, h) {
    return deleteMessage(request, h, 'recipient', this.model);
  },
};

export const deleteOutbox = {
  path: '/outbox/{messageId}',
  method: 'DELETE',
  options: deleteOptions,
  async handler(request, h) {
    return deleteMessage(request, h, 'sender', this.model);
  },
};

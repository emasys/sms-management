import { fetchOptions, sendOptions, fetchMessages } from './smsUtils';
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
    const data = { message, recipient: `${phone}`, sender: phoneNumber };
    const sms = new SmsOps(this.model, h);
    return sms.sendMessage(data);
  },
};

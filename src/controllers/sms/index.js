import Boom from 'boom';
import { options } from './smsUtils';

const fetchUserMessages = {
  path: '/v1/user',
  method: 'GET',
  options,
  async handler(request, h) {
    const {
      auth: {
        credentials: { scope },
      },
    } = request;

    return { scope };
  },
};

export default fetchUserMessages;

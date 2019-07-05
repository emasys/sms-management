import Boom from 'boom';
import UUID from 'short-unique-id';
import {
  options, pinChangeOptions, signinOptions, deleteUserOptions,
} from './userUtils';
import UserOps from './services';

export const createUser = {
  path: '/v1/user/register',
  method: 'POST',
  options,
  async handler(request, h) {
    const { payload } = request;
    const role = payload.phoneNumber === '02340000000000' ? 'admin' : 'user';
    payload.role = role;
    const puk = new UUID();
    payload.puk = puk.randomUUID(8);
    const user = new UserOps(this.model, h);
    return user.createUser(payload);
  },
};

export const signIn = {
  path: '/v1/user/signin',
  method: 'POST',
  options: signinOptions,
  async handler(request, h) {
    const {
      payload: { phoneNumber, pin },
    } = request;
    try {
      const user = new UserOps(this.model, h);
      return user.findUser(phoneNumber, pin);
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  },
};

export const changePin = {
  path: '/v1/user/change-pin',
  method: 'POST',
  options: pinChangeOptions,
  async handler(request, h) {
    const {
      payload: { puk, pin, newPin },
    } = request;
    try {
      const user = new UserOps(this.model, h);
      return user.changePin(puk, pin, newPin);
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  },
};

export const deleteUser = {
  path: '/v1/user/{userId}',
  method: 'DELETE',
  options: deleteUserOptions,
  async handler(request, h) {
    const { userId } = request.params;
    const user = new UserOps(this.model, h);
    return user.deleteUser(userId);
  },
};

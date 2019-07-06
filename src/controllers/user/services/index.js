import bcrypt from 'bcrypt';
import Boom from 'boom';
import { signToken } from '../userUtils';

class UserOps {
  constructor(model, h) {
    this.model = model;
    this.h = h;
  }

  invalidCredentials() {
    return this.h.response({ message: 'Invalid credentials' }).code(404);
  }

  userNotFound() {
    return this.h.response({ message: 'User not found' }).code(404);
  }

  async createUser(payload) {
    try {
      const { phoneNumber, role, puk } = await this.model.Users.create(payload);
      const token = signToken(phoneNumber, role);
      return this.h
        .response({
          message: `${phoneNumber} has been registered`,
          token,
          puk,
          important: 'Keep your puk safe and secret',
        })
        .code(201);
    } catch (error) {
      /* istanbul ignore next */
      if (error.errors && error.errors[0].type === 'unique violation') {
        return this.h
          .response({ message: 'Phone number must be unique' })
          .code(409);
      }
      /* istanbul ignore next */
      return Boom.badRequest(error.message);
    }
  }

  async authenticateUser(phoneNumber = null, pin, puk = null) {
    const where = phoneNumber ? { phoneNumber } : { puk };
    const isUser = await this.model.Users.findOne({ where });
    if (!isUser) {
      return null;
    }
    const isValid = await isUser.validatePin(pin);
    if (!isValid) {
      return null;
    }
    return isUser;
  }

  async findUser(phoneNumber, pin) {
    const isAuthenticated = await this.authenticateUser(phoneNumber, pin);
    if (isAuthenticated) {
      const { role, puk, name } = isAuthenticated;
      const token = signToken(phoneNumber, role);
      return this.h
        .response({
          message: `Hi ${name}`,
          token,
          puk,
        })
        .code(200);
    }
    return this.invalidCredentials();
  }

  // eslint-disable-next-line class-methods-use-this
  async rehashPin(pin) {
    const saltRounds = 10;
    const response = await bcrypt.hash(pin, saltRounds);
    return response;
  }

  async changePin(puk, pin, newPin) {
    const isAuthenticated = await this.authenticateUser(null, pin, puk);
    if (isAuthenticated) {
      const criteria = { where: { puk } };
      const hashedPin = await this.rehashPin(newPin);
      await this.model.Users.update({ pin: hashedPin }, criteria);
      return this.h
        .response({
          message: 'Pin successfully changed',
        })
        .code(200);
    }
    return this.invalidCredentials();
  }

  async deleteUser(id) {
    try {
      const response = await this.model.Users.destroy({ where: { id } });
      if (response) {
        return this.h.response({ message: 'User deleted' }).code(200);
      }
      return this.userNotFound();
    } catch (error) {
      /* istanbul ignore next */
      return this.h
        .response({
          message: "You don't have the privilege to delete a user",
        })
        .code(401);
    }
  }

  async changeRole(id, role) {
    try {
      const [isUpdated] = await this.model.Users.update(
        { role },
        { where: { id } },
      );
      if (isUpdated) {
        return this.h.response({ message: `Role updated to [${role}]` }).code(200);
      }
      return this.userNotFound();
    } catch (error) {
      /* istanbul ignore next */
      return Boom.badImplementation('Could not update role, check log for more info');
    }
  }
}

export default UserOps;

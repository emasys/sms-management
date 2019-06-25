/* eslint-disable no-undef */
import '@babel/polyfill';
import { expect } from 'chai';
import app from '../src';
import models from '../sequelize/models';

describe('test suite for user operations', () => {
  describe('POST /user', () => {
    before((done) => {
      models.sequelize
        .sync({ force: true })
        .then(() => {
          done(null);
        });
    });
    it('should successfully register a user', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000000' },
      });
      expect(statusCode).to.equal(201);
      expect(result).to.eql({ message: '02340000000000 has been registered' });
    });
    it('should fail to register the same user twice', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000000' },
      });
      expect(statusCode).to.equal(409);
      expect(result).to.eql({ message: 'Phone number must be unique' });
    });
    it('should handle incomplete phone number', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '0234000000000' },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message:
          'child "phoneNumber" fails because [Phone number must contain 14 numbers like so - 0234xxxxxxxxxx]',
      });
    });
    it('should handle invalide name', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: {
          name: 'friday12 13th',
          phoneNumber: '02341235482375',
        },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message:
          'child "name" fails because [Name must not contain numbers and special characters]',
      });
    });
  });
});

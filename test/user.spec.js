/* eslint-disable no-undef */
import '@babel/polyfill';
import { expect } from 'chai';
import app from '../src';
import models from '../sequelize/models';

let secretPuk = null;
let adminToken = null;
let userToken = null;
describe('test suite for user operations', () => {
  describe('POST /user', () => {
    before((done) => {
      models.sequelize.sync({ force: true }).then(() => {
        done(null);
      });
    });
    it('should successfully register an admin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000000', pin: '1234' },
      });
      expect(statusCode).to.equal(201);
      adminToken = result.token;
      expect(result).to.include({
        message: '02340000000000 has been registered',
      });
    });
    it('should successfully register a user', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000001', pin: '1234' },
      });
      expect(statusCode).to.equal(201);
      userToken = result.token;
      expect(result).to.include({
        message: '02340000000001 has been registered',
      });
    });
    it('should fail to register the same user twice', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000000', pin: '1234' },
      });
      expect(statusCode).to.equal(409);
      expect(result).to.eql({ message: 'Phone number must be unique' });
    });
    it('should handle incomplete phone number', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '0234000000000', pin: '1234' },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message:
          'child "phoneNumber" fails because [Phone number must contain 14 numbers like so - 0234xxxxxxxxxx]',
      });
    });
    it('should handle invalid name', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: {
          name: 'friday12 13th',
          phoneNumber: '02341235482375',
          pin: '1234',
        },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message:
          'child "name" fails because [Name must not contain numbers and special characters]',
      });
    });
    it('should handle incomplete form', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: {
          name: 'friday',
          phoneNumber: '02341235482375',
        },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message: 'child "pin" fails because [Pin must be four digits]',
      });
    });
    it('should handle invalid credentials', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/signin',
        payload: {
          name: 'friday',
          phoneNumber: '02341235482375',
          pin: '1234',
        },
      });
      expect(statusCode).to.equal(404);
      expect(result).to.include({
        message: 'Invalid credentials',
      });
    });
    it('should handle user sign in', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/signin',
        payload: { phoneNumber: '02340000000000', pin: '1234' },
      });
      secretPuk = result.puk;
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'Hi admin',
      });
    });
    it('should fail to change pin due to wrongly formatted pin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/change-pin',
        payload: { puk: secretPuk, pin: '123', newPin: '1235' },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message: 'child "pin" fails because [Pin must be four digits]',
      });
    });
    it('should fail to change pin due to wrongly formatted new pin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/change-pin',
        payload: { puk: secretPuk, pin: '1234', newPin: '12357' },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message: 'child "newPin" fails because [New pin must be four digits]',
      });
    });
    it('should handle pin change', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/change-pin',
        payload: { puk: secretPuk, pin: '1234', newPin: '1235' },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'Pin successfully changed',
      });
    });
    it('should handle user sign in with new pin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/signin',
        payload: { phoneNumber: '02340000000000', pin: '1235' },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'Hi admin',
      });
    });
    it('should fail to sign in with invalid number', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/signin',
        payload: { phoneNumber: '0234000000000', pin: '1235' },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message: 'child "phoneNumber" fails because [Phone number must contain 14 numbers like so - 0234xxxxxxxxxx]',
      });
    });
    it('should fail to sign in with invalid pin format', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/signin',
        payload: { phoneNumber: '02340000000000', pin: '12366' },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.include({
        message: 'child "pin" fails because [Pin must be four digits]',
      });
    });
    it('should fail to delete a user if not admin', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: '/v1/user/1',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(403);
      expect(result).to.include({
        message: 'Insufficient scope',
      });
    });
    it('should fail to delete a user not registered', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: '/v1/user/10',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(statusCode).to.equal(404);
      expect(result).to.include({
        message: 'User not found',
      });
    });
    it('should fail to update user role', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/user/10',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(statusCode).to.equal(403);
      expect(result).to.include({
        message: 'Insufficient scope',
      });
    });
    it('should update user role', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'PUT',
        url: '/v1/user/2',
        headers: { Authorization: `Bearer ${adminToken}` },
        payload: { role: 'admin' },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'Role updated to [admin]',
      });
    });
  });
});

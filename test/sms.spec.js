/* eslint-disable no-undef */
import '@babel/polyfill';
import { expect } from 'chai';
import app from '../src';
import models from '../sequelize/models';

let messageId = null;
let senderToken = null;
let recipientToken = null;
describe('test suite for sms operations', () => {
  before((done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done(null);
    });
  });
  after(() => {
    app.server.stop();
  });
  describe('Add Users', () => {
    it('should register a sender', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000000', pin: '1234' },
      });
      senderToken = result.token;
      expect(statusCode).to.equal(201);
    });
    it('should register a recipient', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/user/register',
        payload: { name: 'admin', phoneNumber: '02340000000001', pin: '1234' },
      });
      recipientToken = result.token;
      expect(statusCode).to.equal(201);
    });
  });
  describe('Send messages', () => {
    it('should send a message successfully', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/message',
        payload: { message: 'hello there', phone: '02340000000001' },
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(201);
      messageId = result.message.dataValues.id;
      expect(result.message.dataValues).to.include({
        message: 'hello there',
        sender: '02340000000000',
        status: 'delivered',
      });
    });
    it('should fail to send an empty message', async () => {
      const { statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/message',
        payload: { message: '', phone: '02340000000001' },
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(400);
    });
    it('should fail to send a message to an invalid number', async () => {
      const { statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/message',
        payload: { message: 'hello there', phone: '' },
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(400);
    });
    it('should fail to send a message to a non-registered number', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'POST',
        url: '/v1/message',
        payload: { message: 'hello there', phone: '924029349082342' },
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(400);
      expect(result).to.eql({ message: 'Both recipient and sender must be registered' });
    });
  });
  describe('View messages', () => {
    it('should fetch user inbox', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: '/v1/inbox',
        headers: { Authorization: `Bearer ${recipientToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result.data).to.have.lengthOf(1);
      expect(result.data[0].dataValues).to.include({
        message: 'hello there',
        sender: '02340000000000',
        status: 'delivered',
      });
    });
    it('should fetch user outbox', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: '/v1/outbox?limit=1&offset=0',
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result.data).to.have.lengthOf(1);
      expect(result.data[0].dataValues).to.include({
        message: 'hello there',
        recipient: '02340000000001',
        status: 'delivered',
      });
    });
    it('should let sender view a message', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: `/v1/message/${messageId}`,
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'hello there',
        recipient: '02340000000001',
        recipient_status: 'delivered',
      });
    });
    it('should let recipient read a message', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: `/v1/message/${messageId}`,
        headers: { Authorization: `Bearer ${recipientToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'hello there',
        sender: '02340000000000',
        recipient_status: 'read',
      });
    });
  });
  describe('Delete messages', () => {
    it('should soft delete a message - recipient', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: `/v1/inbox/${messageId}`,
        headers: { Authorization: `Bearer ${recipientToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'Message deleted',
      });
    });
    it('should soft delete a message - sender', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: `/v1/outbox/${messageId}`,
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(200);
      expect(result).to.include({
        message: 'Message deleted',
      });
    });
    it('should fail to soft delete a message not sent - sender', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'DELETE',
        url: `/v1/inbox/${messageId}`,
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(401);
      expect(result).to.include({
        message: 'You are not authorized to delete this message',
      });
    });
  });
  describe('404 route', () => {
    it('should try to access an invalid route', async () => {
      const { result, statusCode } = await app.server.inject({
        method: 'GET',
        url: '/v2/inbox',
        headers: { Authorization: `Bearer ${senderToken}` },
      });
      expect(statusCode).to.equal(404);
      expect(result).to.eql({
        message: 'visit our docs at /documentation to view all routes',
        status: 'Not found',
      });
    });
  });
});

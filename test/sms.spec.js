/* eslint-disable no-undef */
import '@babel/polyfill';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src';
import models from '../sequelize/models';

let messageId = null;
describe('test suite for sms operations', () => {
  describe('POST /message', () => {
    before((done) => {
      models.sequelize
        .sync({ force: true })
        .then(() => {
          done(null);
        })
        .catch((errors) => {
          done(errors);
        });
    });
    it('should register a sender', (done) => {
      request(app.server.listener)
        .post('/v1/user/register')
        .send({
          name: 'admin',
          phoneNumber: '02340000000000',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: '02340000000000 has been registered' });
            return done();
          }
          return done(err);
        });
    });
    it('should register a receiver', (done) => {
      request(app.server.listener)
        .post('/v1/user/register')
        .send({
          name: 'admin',
          phoneNumber: '02341235482376',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: '02341235482376 has been registered' });
            return done();
          }
          return done(err);
        });
    });
    it('should fail to recognize sender', (done) => {
      request(app.server.listener)
        .post('/v1/message')
        .set('phone', '')
        .send({
          message: 'Hello john',
          phone: '02341235482376',
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
    it('should send a message successfully', (done) => {
      request(app.server.listener)
        .post('/v1/message')
        .set('phone', '02340000000000')
        .send({
          message: 'Hello john',
          phone: '02341235482376',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            messageId = res.body.message.id;
            expect(res.body.message).to.include({
              message: 'Hello john',
              sender: '02340000000000',
              status: 'delivered',
            });
            return done();
          }
          return done(err);
        });
    });
    it('should fail to send an empty message', (done) => {
      request(app.server.listener)
        .post('/v1/message')
        .set('phone', '02340000000000')
        .send({
          message: '',
          phone: '02341235482376',
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
    it('should fail to send a message to an invalid number', (done) => {
      request(app.server.listener)
        .post('/v1/message')
        .set('phone', '02340000000000')
        .send({
          message: 'hello world',
          phone: '',
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
    it('should fetch user inbox', (done) => {
      request(app.server.listener)
        .get('/v1/inbox')
        .set('phone', '02341235482376')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body.data).to.have.lengthOf(1);
            expect(res.body.data[0]).to.include({
              message: 'Hello john',
              sender: '02340000000000',
              recipient_status: 'delivered',
            });
            return done();
          }
          return done(err);
        });
    });
    it('should fetch user outbox', (done) => {
      request(app.server.listener)
        .get('/v1/outbox?limit=1&offset=0')
        .set('phone', '02340000000000')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body.data).to.have.lengthOf(1);
            expect(res.body.data[0]).to.include({
              message: 'Hello john',
              sender: '02340000000000',
              status: 'delivered',
            });
            return done();
          }
          return done(err);
        });
    });
    it('should read a message', (done) => {
      request(app.server.listener)
        .get(`/v1/message/${messageId}`)
        .set('phone', '02341235482376')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message: 'Hello john',
              sender: '02340000000000',
              recipient_status: 'read',
            });
            return done();
          }
          return done(err);
        });
    });
    it('should view a message', (done) => {
      request(app.server.listener)
        .get(`/v1/message/${messageId}`)
        .set('phone', '02340000000000')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message: 'Hello john',
              recipient: '02341235482376',
              recipient_status: 'read',
            });
            return done();
          }
          return done(err);
        });
    });
    it('should soft delete a message - recipient', (done) => {
      request(app.server.listener)
        .delete(`/v1/inbox/${messageId}`)
        .set('phone', '02341235482376')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: 'Message deleted' });
            return done();
          }
          return done(err);
        });
    });
    it('should soft delete a message - sender', (done) => {
      request(app.server.listener)
        .delete(`/v1/outbox/${messageId}/`)
        .set('phone', '02340000000000')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: 'Message deleted' });
            return done();
          }
          return done(err);
        });
    });
  });
});

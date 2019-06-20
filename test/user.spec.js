/* eslint-disable no-undef */
import '@babel/polyfill';
import request from 'supertest';
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
        })
        .catch((errors) => {
          done(errors);
        });
    });
    it('should successfully register a user', (done) => {
      request(app.server.listener)
        .post('/v1/user/register')
        .send({
          name: 'admin',
          phoneNumber: '02341235482375',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: '02341235482375 has been registered' });
            return done();
          }
          return done(err);
        });
    });
    it('should fail to register the same user twice', (done) => {
      request(app.server.listener)
        .post('/v1/user/register')
        .send({
          name: 'admin',
          phoneNumber: '02341235482375',
        })
        .expect('Content-Type', /json/)
        .expect(409)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({ message: 'phoneNumber must be unique' });
            return done();
          }
          return done(err);
        });
    });
    it('should handle incomplete phone number', (done) => {
      request(app.server.listener)
        .post('/v1/user/register')
        .send({
          name: 'john doe',
          phoneNumber: '0234123548237',
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message:
                'child "phoneNumber" fails because [Phone number must contain 14 numbers like so - 0234xxxxxxxxxx]',
            });
            return done();
          }
          return done(err);
        });
    });
    it('should handle invalid name', (done) => {
      request(app.server.listener)
        .post('/v1/user/register')
        .send({
          name: 'friday12 13th',
          phoneNumber: '02341235482375',
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (!err) {
            expect(res.body).to.include({
              message:
                'child "name" fails because [Name must not contain numbers and special characters]',
            });
            return done();
          }
          return done(err);
        });
    });
  });
});

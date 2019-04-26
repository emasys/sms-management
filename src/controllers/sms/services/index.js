/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import Boom from 'boom';

class SmsOps {
  constructor(model, h) {
    this.model = model;
    this.h = h;
  }

  async sendMessage(data) {
    if (data.recipient === data.sender) {
      return Boom.badRequest('You cannot send a message to yourself.');
    }
    try {
      const response = await this.model.Sms.create(data);
      return this.h.response({ message: response }).code(201);
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }

  async fetch(limit, offset, phoneNumber = null) {
    const criteria = phoneNumber ? { where: { recipient: phoneNumber } } : {};
    try {
      const response = await this.model.Sms.findAndCountAll({
        limit,
        offset,
        ...criteria,
      });

      const data = response.rows;
      const meta = {};
      const total = response.count;
      const computePage = Math.floor(total / limit);
      const pages = computePage === 0 ? 1 : computePage;
      meta.total = total;
      meta.limit = limit;
      meta.offset = offset;
      meta.pages = pages;
      return { data, meta };
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }

  async readMessage(id, recipient) {
    const criteria = { where: { id, recipient } };
    try {
      const [response] = await this.model.Sms.update({ status: 'read' }, criteria);
      if (response) {
        return this.model.Sms.findOne(criteria);
      }
      return Boom.unauthorized('You are not authorized to view this message');
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }

  handleDeleteCriteria(id, phone, user) {
    const criteria = {
      recipient: { where: { id, recipient: phone }, returning: true, raw: true },
      sender: { where: { id, sender: phone }, returning: true, raw: true },
    };

    return criteria[user];
  }

  handleDeleteQuery(id, phone, user) {
    const criteria = {
      recipient: { recipient_status: 'deleted' },
      sender: { status: 'deleted' },
    };

    return criteria[user];
  }

  async deleteMessage(id, phone, user) {
    const criteria = this.handleDeleteCriteria(id, phone, user);
    const query = this.handleDeleteQuery(id, phone, user);
    try {
      const [response, [data]] = await this.model.Sms.update(query, criteria);
      if (response) {
        const { status, recipient_status } = data;
        if (status === 'deleted' && status === recipient_status) {
          await this.model.Sms.destroy(criteria);
        }
        return { message: 'Message deleted' };
      }
      return Boom.unauthorized('You are not authorized to delete this message');
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }
}

export default SmsOps;

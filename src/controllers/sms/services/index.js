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

  async readMessage(id) {
    const criteria = { where: { id } };
    try {
      const [response] = await this.model.Sms.update({ read: 'true' }, criteria);
      if (response) {
        return this.model.Sms.findOne(criteria);
      }
      throw new Error(
        'Invalid message Id',
      );
    } catch (error) {
      return Boom.badRequest(error.message);
    }
  }
}

export default SmsOps;

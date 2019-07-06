/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      defaultValue: 'user',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Users.beforeCreate(async (pendingUser) => {
    pendingUser.pin = await pendingUser.generatePasswordHash();
  });

  Users.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    const response = await bcrypt.hash(this.pin, saltRounds);
    return response;
  };

  Users.prototype.validatePin = async function (pin) {
    const response = await bcrypt.compare(pin, this.pin);
    return response;
  };

  return Users;
};

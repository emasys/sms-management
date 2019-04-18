module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Sms', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    recipient: {
      type: Sequelize.STRING,
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
    },
    read: {
      type: Sequelize.ENUM,
      values: [false, true],
      defaultValue: 'false',
    },
    sender: {
      type: Sequelize.STRING,
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Sms'),
};

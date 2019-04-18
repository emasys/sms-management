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
    status: {
      type: Sequelize.ENUM,
      values: ['read', 'delivered'],
      defaultValue: 'delivered',
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

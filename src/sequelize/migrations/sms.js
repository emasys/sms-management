module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Sms', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    recipient: {
      type: Sequelize.STRING,
      onDelete: 'SET NULL',
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
    },
    recipient_status: {
      type: Sequelize.ENUM,
      values: ['read', 'deleted', 'delivered'],
      defaultValue: 'delivered',
    },
    status: {
      type: Sequelize.ENUM,
      values: ['delivered', 'deleted'],
      defaultValue: 'delivered',
    },
    sender: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
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

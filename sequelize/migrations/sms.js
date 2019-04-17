module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Sms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    recipient: {
      type: Sequelize.STRING,
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
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

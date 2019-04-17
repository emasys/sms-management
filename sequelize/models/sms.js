export default (sequelize, DataTypes) => {
  const Sms = sequelize.define('Sms', {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
    },
    sender: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
    },
  });

  Sms.associate = (models) => {
    Sms.belongsTo(models.Users, {
      foreignKey: 'sender',
    });
  };
  Sms.associate = (models) => {
    Sms.belongsTo(models.Users, {
      foreignKey: 'recipient',
    });
  };

  return Sms;
};

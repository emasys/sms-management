export default (sequelize, DataTypes) => {
  const Sms = sequelize.define('Sms', {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    recipient: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'phoneNumber',
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ['read', 'delivered'],
      defaultValue: 'delivered',
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

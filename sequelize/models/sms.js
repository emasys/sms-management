export default (sequelize, DataTypes) => {
  const Sms = sequelize.define('Sms', {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
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

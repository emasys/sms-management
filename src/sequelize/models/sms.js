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
    recipient_status: {
      type: DataTypes.ENUM,
      values: ['read', 'deleted', 'delivered'],
      defaultValue: 'delivered',
    },
    status: {
      type: DataTypes.ENUM,
      values: ['delivered', 'deleted'],
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
    /* istanbul ignore next */
    Sms.belongsTo(models.Users, {
      foreignKey: 'sender',
      onDelete: 'CASCADE',
    });
  };
  Sms.associate = (models) => {
    Sms.belongsTo(models.Users, {
      foreignKey: 'recipient',
      onDelete: 'SET NULL',
    });
  };

  return Sms;
};

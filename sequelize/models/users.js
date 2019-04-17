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
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Sms, {
      foreignKey: 'id',
    });
  };

  return Users;
};

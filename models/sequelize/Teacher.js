module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'teacher',
    {
      // model name
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(12),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      login_date: {
        type: DataTypes.DATE,
      },
      birth_date: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      tableName: 'teacher',
      timestamps: false,
    }
  );
};

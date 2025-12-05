module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'course',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'course',
    }
  );
};

/* eslint-disable comma-dangle */
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../sequelize');

const Users = sequelize.define(
  'Users',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: { type: DataTypes.STRING, allowNull: false },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },

  {
    tableName: 'users',
    timestamps: false,
  },
);

Users.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  // eslint-disable-next-line no-param-reassign
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = Users;

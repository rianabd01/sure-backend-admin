/* eslint-disable comma-dangle */
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Cities = sequelize.define(
  'Cities',
  {
    city_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    province_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: 'cities',
    timestamps: false,
  },
);

module.exports = Cities;

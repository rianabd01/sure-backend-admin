/* eslint-disable comma-dangle */
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Pictures = sequelize.define(
  'Pictures',
  {
    picture_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_path: { type: DataTypes.STRING, allowNull: false },
    trash_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'trash_pictures',
    timestamps: false,
  }
);

module.exports = Pictures;

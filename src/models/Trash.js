/* eslint-disable comma-dangle */
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Trash = sequelize.define(
  'Trash',
  {
    trash_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    city_id: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    location_url: { type: DataTypes.STRING, allowNull: false },
    user_uploader_id: { type: DataTypes.INTEGER, allowNull: true },
    is_verified: { type: DataTypes.TINYINT, allowNull: true },
    user_finisher_id: { type: DataTypes.INTEGER, allowNull: true },
    is_deleted: { type: DataTypes.TINYINT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'trash',
    timestamps: false,
  },
);

module.exports = Trash;

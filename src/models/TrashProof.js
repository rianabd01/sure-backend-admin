/* eslint-disable comma-dangle */
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const TrashProof = sequelize.define(
  'TrashProof',
  {
    trash_proof_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trash_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    user_message: { type: DataTypes.TEXT, allowNull: false },
    feedback: { type: DataTypes.TEXT, allowNull: true },
    is_verified: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'trash_proof',
    timestamps: false,
  },
);

module.exports = TrashProof;

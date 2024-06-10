/* eslint-disable comma-dangle */
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ProofPictures = sequelize.define(
  'Proofictures',
  {
    picture_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_path: { type: DataTypes.STRING, allowNull: false },
    trash_proof_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'trash_proof_pictures',
    timestamps: false,
  },
);

module.exports = ProofPictures;

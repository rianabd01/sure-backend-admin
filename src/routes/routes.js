const Joi = require('joi');
const getTrashList = require('../handler/trash/GetTrashList');
const loginHandler = require('../handler/auth/LoginHandler');
const putVerifyTrash = require('../handler/trash/PutVerifyTrash');
const getTrashProofList = require('../handler/trash/GetTrashProofList');
const putVerifyTrashProof = require('../handler/trash/PutVerifyTrashProof');
const putToDeleteTrash = require('../handler/trash/PutToDeleteTrash');
const getTrashDetail = require('../handler/trash/GetTrashDetail');
const getTrashProofDetail = require('../handler/trash/GetTrashProofDetail');
const putToUnDeleteTrash = require('../handler/trash/PutToUnDeleteTrash');

const routes = [
  {
    method: 'GET',
    path: '/trash',
    handler: getTrashList,
  },
  {
    method: 'GET',
    path: '/trash/{id}',
    handler: getTrashDetail,
  },
  {
    method: 'GET',
    path: '/proof',
    handler: getTrashProofList,
  },
  {
    method: 'GET',
    path: '/proof/{id}',
    handler: getTrashProofDetail,
  },

  {
    method: 'PUT',
    path: '/verify-trash/{id}',
    handler: putVerifyTrash,
  },
  {
    method: 'PUT',
    path: '/remove-trash/{id}',
    handler: putToDeleteTrash,
  },
  {
    method: 'PUT',
    path: '/unremove-trash/{id}',
    handler: putToUnDeleteTrash,
  },
  {
    method: 'PUT',
    path: '/verify-proof/{id}',
    handler: putVerifyTrashProof,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
];

module.exports = routes;

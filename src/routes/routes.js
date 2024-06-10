const Joi = require('joi');
const getTrashDetail = require('../handler/trash/GetTrashDetail');
const getTrashList = require('../handler/trash/GetTrashList');
const loginHandler = require('../handler/auth/LoginHandler');
const putVerifyTrash = require('../handler/trash/PutVerifyTrash');
const getTrashProofList = require('../handler/trash/GetTrashProofList');
const putVerifyTrashProof = require('../handler/trash/PutVerifyTrashProof');

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
    path: '/trash/proof',
    handler: getTrashProofList,
  },

  {
    method: 'PUT',
    path: '/verify-trash/{id}',
    handler: putVerifyTrash,
  },
  {
    method: 'PUT',
    path: '/verify-proof/{id}',
    handler: putVerifyTrashProof,
  },
  // {
  //   method: 'POST',
  //   path: '/verify-proof/{id}',
  //   handler: postTrashProofHandler,
  // },

  // User auth
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

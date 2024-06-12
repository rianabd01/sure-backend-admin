// const { Op } = require('sequelize');
const dotenv = require('dotenv');
const {
  Trash,
  TrashProof,
  ProofPictures,
  Users,
} = require('../../associations/index');
const userJWTVerification = require('../UserJWTVerification');

dotenv.config();
const getTrashProofList = async (request, h) => {
  // eslint-disable-next-line object-curly-newline
  const { verified, datesort = 'desc' } = request.query;
  const userId = userJWTVerification(request);

  try {
    const user = await Users.findByPk(userId);

    // Check if send his valid token
    if (!userId) {
      return h
        .response({
          status: 'fail',
          message: 'you must login first as admin',
        })
        .code(404);
    }

    // Check if admin found
    if (!user) {
      return h
        .response({
          status: 'fail',
          message: 'user not found',
        })
        .code(404);
    }

    // Check if user is admin
    if (user.level !== 100) {
      return h
        .response({
          status: 'fail',
          message: 'you are not admin',
        })
        .code(403);
    }

    const whereClause = {};
    if (verified !== undefined) {
      whereClause.is_verified = verified;
    }

    const trashProofList = await TrashProof.findAll({
      include: [
        {
          model: Trash,
          attributes: ['trash_id', 'title', 'description'],
        },
        {
          model: Users,
          attributes: ['user_id', 'full_name'],
        },
        {
          model: ProofPictures,
          as: 'proof_pictures',
          attributes: ['image_path'],
        },
      ],
      where: whereClause,
      order: [['created_at', datesort]],
    });

    // // Check if trash list not found
    // if (!trashProofList || trashProofList.length === 0) {
    //   return h
    //     .response({
    //       status: 'fail',
    //       message: 'trash list is not found',
    //     })
    //     .code(202);
    // }

    // Result if trash found
    let serverHostURL = `${process.env.SERVER_HOST}`;
    if (process.env.SERVER_HOST === 'localhost') {
      serverHostURL += `:${process.env.SERVER_PORT}`;
    }

    const results = trashProofList.map((proof) => ({
      trash_id: proof.Trash.trash_id,
      trash_proof_id: proof.trash_proof_id,
      user_message: proof.user_message,
      user_id: proof.User.user_id,
      name: proof.User.full_name,
      is_verified: proof.is_verified,
      pictures:
        proof.proof_pictures.length > 0
          ? serverHostURL + proof.proof_pictures[0].image_path
          : null,
      created_at: proof.created_at,
    }));

    return h
      .response({
        status: 'success',
        message: 'success GET trash list',
        results,
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: 'something wrong',
        error: error.message,
      })
      .code(500);
  }
};

module.exports = getTrashProofList;

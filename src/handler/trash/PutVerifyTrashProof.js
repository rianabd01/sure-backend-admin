const { Users, TrashProof } = require('../../associations');
const getUserIdFromToken = require('../UserJWTVerification');

const putVerifyTrashProof = async (request, h) => {
  const { id } = request.params;
  const userId = getUserIdFromToken(request);
  // eslint-disable-next-line camelcase

  try {
    const trashProofItem = await TrashProof.findByPk(id);
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

    // Check if trashItem found
    if (!trashProofItem) {
      return h
        .response({
          status: 'fail',
          message: 'trash not found',
        })
        .code(404);
    }

    // Check if trashItem already verified
    if (trashProofItem.is_verified === 1) {
      return h
        .response({
          status: 'fail',
          message: 'trash already verified',
        })
        .code(403);
    }

    // Verify the trash proof
    // eslint-disable-next-line camelcase
    trashProofItem.is_verified = 1;
    await trashProofItem.save();

    return h.response({
      status: 'success',
      message: 'verify trash success',
    });
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: error.message,
      })
      .code(500);
  }
};

module.exports = putVerifyTrashProof;

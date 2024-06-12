const { Users, TrashProof, Trash } = require('../../associations');
const sequelize = require('../../sequelize');
const getUserIdFromToken = require('../UserJWTVerification');

const putVerifyTrashProof = async (request, h) => {
  const { id } = request.params;
  const userId = getUserIdFromToken(request);
  // eslint-disable-next-line camelcase

  try {
    const trashProofItem = await TrashProof.findByPk(id);
    const trash = await Trash.findByPk(trashProofItem.trash_id);
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
          message: 'proof not found',
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

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Verify the trash proof
      // eslint-disable-next-line camelcase
      trashProofItem.is_verified = 1;
      trash.user_finisher_id = trashProofItem.user_id;

      // Save both changes within the transaction
      await trashProofItem.save({ transaction });
      await trash.save({ transaction });

      // Commit the transaction if all operations succeed
      await transaction.commit();

      return h.response({
        status: 'success',
        message: 'verify proof success',
      });
    } catch (error) {
      // Rollback the transaction if any operation fails
      await transaction.rollback();
      throw error; // Rethrow the error for the outer catch block
    }
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

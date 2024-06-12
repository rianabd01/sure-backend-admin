const { Users, Trash } = require('../../associations');
const getUserIdFromToken = require('../UserJWTVerification');

const putToUnDeleteTrash = async (request, h) => {
  const { id } = request.params;
  const userId = getUserIdFromToken(request);
  // eslint-disable-next-line camelcase

  try {
    const trashItem = await Trash.findByPk(id);
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
    if (!trashItem) {
      return h
        .response({
          status: 'fail',
          message: 'trash not found',
        })
        .code(404);
    }

    // Check if trashItem already deleted
    if (trashItem.is_deleted === 0) {
      return h
        .response({
          status: 'fail',
          message: 'trash is not deleted',
        })
        .code(403);
    }

    // Delete the trash
    // eslint-disable-next-line camelcase
    trashItem.is_deleted = 0;
    await trashItem.save();

    return h.response({
      status: 'success',
      message: 'undelete trash success',
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

module.exports = putToUnDeleteTrash;

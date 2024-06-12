const dotenv = require('dotenv');
// eslint-disable-next-line object-curly-newline
const {
  Trash,
  Cities,
  Users,
  TrashProof,
  ProofPictures,
} = require('../../associations/index');
const userJWTVerification = require('../UserJWTVerification');

dotenv.config();
const getTrashProofDetail = async (request, h) => {
  const { id } = request.params;
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

    // Find trash by id
    const trashProof = await TrashProof.findByPk(id, {
      include: [
        {
          model: ProofPictures,
          as: 'proof_pictures',
          attributes: ['image_path'],
        },

        {
          model: Users,
          attributes: ['full_name', 'user_id'],
        },
        {
          model: Trash,
          attributes: ['title', 'address', 'location_url'],
          include: [{ model: Cities, as: 'cities', attributes: ['name'] }],
        },
      ],
    });

    // Check if trash not found
    if (!trashProof) {
      return h
        .response({
          status: 'fail',
          message: 'proof not found',
        })
        .code(404);
    }

    // Result if trash found
    let serverHostURL = `${process.env.SERVER_HOST}`;
    if (process.env.SERVER_HOST === 'localhost') {
      serverHostURL += `:${process.env.SERVER_PORT}`;
    }

    const results = {
      id: trashProof.trash_proof_id,
      trash_id: trashProof.trash_id,
      title: trashProof.Trash.title,
      user_message: trashProof.user_message,
      city: trashProof.Trash.cities.name,
      address: trashProof.Trash.address,
      location_url: trashProof.Trash.location_url,
      finisher_id: trashProof.user_id,
      finisher: trashProof.User.full_name,
      pictures: trashProof.proof_pictures.map(
        (picture) => `${serverHostURL}${picture.image_path}`,
      ),
      is_verified: trashProof.is_verified,
    };

    return h
      .response({
        status: 'success',
        message: 'success GET detail',
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

module.exports = getTrashProofDetail;

// eslint-disable-next-line object-curly-newline
const dotenv = require('dotenv');
// eslint-disable-next-line object-curly-newline
const { Trash, Pictures, Cities, Users } = require('../../associations/index');
const userJWTVerification = require('../UserJWTVerification');

dotenv.config();
const getTrashDetail = async (request, h) => {
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
    const trash = await Trash.findByPk(id, {
      include: [
        {
          model: Pictures,
          as: 'pictures',
          attributes: ['image_path'],
        },
        {
          model: Cities,
          as: 'cities',
          attributes: ['name'],
        },
        {
          model: Users,
          as: 'users',
          attributes: ['full_name', 'user_id'],
        },
      ],
    });

    // Check if trash not found
    if (!trash) {
      return h
        .response({
          status: 'fail',
          message: 'trash not found',
        })
        .code(404);
    }

    // Result if trash found
    let serverHostURL = `${process.env.SERVER_HOST}`;
    if (process.env.SERVER_HOST === 'localhost') {
      serverHostURL += `:${process.env.SERVER_PORT}`;
    }

    const results = {
      id: trash.trash_id,
      title: trash.title,
      description: trash.description,
      city: trash.cities.name,
      address: trash.address,
      location_url: trash.location_url,
      uploader_id: trash.users.user_id === 3 ? 3 : trash.users.user_id,
      uploader: trash.users.full_name,
      pictures: trash.pictures.map(
        (picture) => `${serverHostURL}${picture.image_path}`,
      ),
      is_verified: trash.is_verified,
      is_deleted: trash.is_deleted,
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

module.exports = getTrashDetail;

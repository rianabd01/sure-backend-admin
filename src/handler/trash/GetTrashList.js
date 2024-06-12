const { Op } = require('sequelize');
const dotenv = require('dotenv');
// eslint-disable-next-line object-curly-newline
const { Trash, Pictures, Cities, Users } = require('../../associations/index');
const userJWTVerification = require('../UserJWTVerification');

dotenv.config();
const getTrashList = async (request, h) => {
  // eslint-disable-next-line object-curly-newline
  const { location, verified, deleted, datesort = 'desc' } = request.query;

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
    if (deleted !== undefined) {
      whereClause.is_deleted = deleted;
    }

    const trashList = await Trash.findAll({
      include: [
        {
          model: Cities,
          as: 'cities',
          attributes: ['name'],
          where: location ? { name: { [Op.like]: `%${location}%` } } : {},
        },
        {
          model: Pictures,
          as: 'pictures',
          attributes: ['image_path'],
        },
      ],
      where: whereClause,
      order: [['created_at', datesort]],
    });

    // Check if trash list not found
    // if (!trashList || trashList.length === 0) {
    //   return h
    //     .response({
    //       status: 'fail',
    //       message: 'trash list is not found',
    //     })
    //     .code(404);
    // }

    // Result if trash found
    let serverHostURL = `${process.env.SERVER_HOST}`;
    if (process.env.SERVER_HOST === 'localhost') {
      serverHostURL += `:${process.env.SERVER_PORT}`;
    }

    const results = trashList.map((trash) => ({
      id: trash.trash_id,
      title: trash.title,
      description: trash.description,
      city: trash.cities.name,
      is_verified: trash.is_verified,
      is_deleted: trash.is_deleted,
      pictures:
        trash.pictures.length > 0
          ? serverHostURL + trash.pictures[0].image_path
          : null,
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

module.exports = getTrashList;

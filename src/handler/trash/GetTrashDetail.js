// eslint-disable-next-line object-curly-newline
const dotenv = require('dotenv');
const {
  Trash,
  Pictures,
  Cities,
  Users,
  TrashProof,
} = require('../../associations/index');

dotenv.config();
const getTrashDetail = async (request, h) => {
  const { id } = request.params;

  try {
    // Check if anyone has send proof
    const trashProofExists = await TrashProof.findOne({
      where: {
        trash_id: id,
      },
    });

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

    const result = {
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
      is_proofed: trashProofExists ? 1 : 0,
      is_finished: trashProofExists ? trashProofExists.is_verified : 0,
    };

    return h
      .response({
        status: 'success',
        message: 'success GET detail',
        result,
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

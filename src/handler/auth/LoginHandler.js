const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Users } = require('../../associations/index');

dotenv.config();

const loginHandler = async (request, h) => {
  const { username, password } = request.payload;
  const authHeader = request.headers.authorization;

  // Check existing token
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, process.env.JWT_KEY);
      return h.response({ token }).code(200);
    } catch (error) {
      // Proceed as usual login process
    }
  }

  // Check Columns Validation
  if (!username || !password) {
    return h
      .response({
        status: 'fail',
        message: 'please fill all columns',
      })
      .code(400);
  }

  // Find user on database
  const user = await Users.findOne({ where: { username, is_verified: 1 } });
  if (!user) {
    return h
      .response({
        status: 'fail',
        message: 'invalid username',
      })
      .code(401);
  }

  // Check is password match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return h
      .response({
        status: 'fail',
        message: 'password doesnt match',
      })
      .code(401);
  }

  // Generate Token
  const token = jwt.sign(
    {
      id: user.user_id,
      username: user.username,
    },
    process.env.JWT_KEY,
    { expiresIn: '30d' },
  );

  return h.response({ token, full_name: user.full_name }).code(200);
};

module.exports = loginHandler;

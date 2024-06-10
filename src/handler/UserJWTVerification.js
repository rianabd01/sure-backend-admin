const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// eslint-disable-next-line consistent-return
function getUserIdFromToken(req) {
  const auth = req.headers.authorization;

  if (auth) {
    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      return decoded.id;
    } catch (error) {
      console.log('token invalid');
      // return 'token invalid';
    }
  }
}

module.exports = getUserIdFromToken;

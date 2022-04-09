const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {

  const jwtToken = req.header('token');

  try {
    // check if token exists
    if(!jwtToken) {
      return res.status(403).send('Not Authorized');
    }

    // verify if the token is correct (it's named payload because if true it returns a 'payload' that we can use in our routes)
    const payload = jwt.verify(jwtToken, process.env.jwtSecret)
    req.user = payload.user
    next();

  } catch (error) {
    console.log(error)
    return res.status(403).send('Not Authorized');
  }
}
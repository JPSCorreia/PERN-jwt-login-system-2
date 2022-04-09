const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const authorization = require('../middleware/authorization');
const validInfo = require("../middleware/validInfo");


// registering
router.post('/register', validInfo, async (req, res) => {
  // 1. destructure the request body (name, email and pass)
  const { name, email, password } = req.body;

  try {
    // 2. if user exists then throw an error
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email.toLowerCase()]);
    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists')
    }

    // 3. Bcrypt the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. insert the new user into our database 
    const newUser = await pool.query("INSERT INTO users(user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *", [name, email.toLowerCase(), bcryptPassword])

    // 5. generate and return jwt token
    const token = jwtGenerator(newUser.rows[0].user_id)
    res.json({ token });

  } catch(error) {
    console.error(error.message)
    res.status(500).send('Server error.')
  }
})

// login
router.post('/login', validInfo, async (req, res) => {
  // 1. destructure the request body (email and pass only, no name required for login)
  const { email, password } = req.body;

  try {
    // 2. if user doesn't exist then throw an error
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).send('Email / Password incorrect.')
    }

    // 3. check if incoming password is the same as database password
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password) // returns boolean if true
    if (!validPassword) {
      return res.status(401).send('Email / Password incorrect.')
    }

    // 4. generate and return jwt token
    const token = jwtGenerator(user.rows[0].user_id)
    res.json({ token });
    
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error.')
  }
})

// 
router.get('/is-verify', authorization, async (req, res) => {
  try {
    res.json(true) // return true if authorized
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error.')
  }
})

module.exports = router;
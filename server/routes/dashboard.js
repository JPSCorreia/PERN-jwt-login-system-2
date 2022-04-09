const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/', authorization, async(req, res) => {

  try {
    //req.user already has the payload from the authorization middleware
    const user = await pool.query('SELECT user_name FROM users WHERE user_id = $1', [req.user.id])
    res.json(user.rows[0])

  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server error.')
  }
})

module.exports = router;
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const config = require('../config');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyToken(req, res) {
    res.json({ valid: true });
  }
}

module.exports = new AuthController();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authController = {
  login: async (req, res) => {
    const { email, contrasena } = req.body;
    
    if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: user.usuario_id, rol: user.rol_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;

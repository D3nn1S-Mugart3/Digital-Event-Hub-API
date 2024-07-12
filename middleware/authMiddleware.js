const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id); 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user; 

        const expirationDate = new Date(decoded.exp * 1000); 
        await Token.create({
            usuario_id: user.usuario_id,
            token,
            expiracion: expirationDate
        });

        next();
    } catch (err) {
        console.error('Failed to authenticate token:', err);
        return res.status(401).json({ error: 'Failed to authenticate token' });
    }
};

module.exports = authMiddleware;

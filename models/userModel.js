const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('Usuarios', {
  usuario_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('contrasena', hashedPassword);
    },
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  membresia_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foto_perfil: {
    type: DataTypes.STRING, // Tipo de dato para almacenar la URL de la imagen
    allowNull: true, // Permite que el campo sea nulo inicialmente
  },
}, {
  tableName: 'Usuarios',
  timestamps: false,
});

module.exports = User;

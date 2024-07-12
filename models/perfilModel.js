const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Importa tu instancia de Sequelize

const Perfil = sequelize.define('Usuarios', {
  foto_perfil: {
    type: DataTypes.STRING, // Aquí se almacenará la URL de la imagen de perfil
    allowNull: true, // Puede ser null si el usuario aún no ha subido una foto de perfil
  },
});

module.exports = Perfil;

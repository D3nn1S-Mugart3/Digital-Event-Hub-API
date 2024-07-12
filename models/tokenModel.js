const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Token = sequelize.define('Tokens', {
    token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'usuario_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    expiracion: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Tokens',
    timestamps: false 
});

module.exports = Token;

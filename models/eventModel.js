const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Evento = sequelize.define('Eventos', {
    evento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_termino: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    max_per: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fecha_autorizacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tipo_evento_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    organizador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    autorizado_por: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'Eventos',
    timestamps: false,
});

module.exports = Evento;

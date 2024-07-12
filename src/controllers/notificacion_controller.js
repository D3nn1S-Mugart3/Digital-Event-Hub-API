const pool = require('../db/connection');

const receiveNotification = async (req, res) => {
    const { usuario_id, mensaje } = req.body;

    try {
        // Guarda la notificación en la base de datos
        const [result] = await pool.query(
            'INSERT INTO NotificacionO (usuario_id, mensaje) VALUES (?, ?)',
            [usuario_id, mensaje]
        );

        console.log('Notificación guardada:', { id: result.insertId, usuario_id, mensaje });

        res.status(200).send('Notificación recibida');
    } catch (error) {
        console.error('Error al guardar la notificación:', error);
        res.status(500).send('Error al procesar la notificación');
    }
};

const viewNotifications = async (req, res) => {
    try {
        // Consulta para obtener todas las notificaciones
        const [rows] = await pool.query(
            'SELECT * FROM NotificacionO'
        );
        // Enviar los resultados como respuesta
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        res.status(500).send('Error al obtener las notificaciones');
    }
};

module.exports = {
    receiveNotification,
    viewNotifications
};

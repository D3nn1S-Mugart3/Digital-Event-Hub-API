const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificacion_controller');

/**
 * @openapi
 * /api/notifications/send:
 *   post:
 *     description: Recibe una notificación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               mensaje:
 *                 type: string
 *                 example: "Notification message"
 *     responses:
 *       200:
 *         description: Notificación recibida.
 *       500:
 *         description: Error al procesar la notificación.
 */
router.post('/send', notificationController.receiveNotification);

/**
 * @openapi
 * /api/notifications/getAll:
 *   get:
 *     description: Obtiene todas las notificaciones.
 *     responses:
 *       200:
 *         description: Lista de notificaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   notificacion_id:
 *                     type: integer
 *                     example: 1
 *                   usuario_id:
 *                     type: integer
 *                     example: 1
 *                   mensaje:
 *                     type: string
 *                     example: "Notification message"
 *                   fecha_envio:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-07-10T14:48:00.000Z"
 *       500:
 *         description: Error al obtener las notificaciones.
 */
router.get('/getAll', notificationController.viewNotifications);

module.exports = router;

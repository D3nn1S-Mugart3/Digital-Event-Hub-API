const express = require('express');
const router = express.Router();

const notificationRoutes = require('./routes/routesNotification');
// const eventsRoutes = require('./eventRoutes');

router.use('/notifications', notificationRoutes);
// router.use('/events', eventsRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
const Evento = require('../functions/function.event');


router.get('/api/events', Evento.getEvents)
router.get('/api/events/q', Evento.filtro)

module.exports = router

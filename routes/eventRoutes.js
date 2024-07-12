const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, eventController.createEvent);
router.put('/update/:evento_id', authMiddleware, eventController.updateEvent);
router.get('/organizer', authMiddleware, eventController.listOrganizerEvents);

router.get('/pending', authMiddleware, eventController.listPendingEvents);
router.post('/approve/:evento_id', authMiddleware, eventController.approveEvent);
router.post('/disapprove/:evento_id', authMiddleware, eventController.disapproveEvent);

module.exports = router;

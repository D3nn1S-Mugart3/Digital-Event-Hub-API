const express = require("express");
const router = express.Router();
const userRouter = require("./routes/routesUser");
const notificationRoutes = require("./routes/routesNotification");
// const eventsRoutes = require('./eventRoutes');

router.use("/notifications", notificationRoutes);
// router.use('/events', eventsRoutes);
router.use("/user", userRouter);

module.exports = router;

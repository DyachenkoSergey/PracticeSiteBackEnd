const express = require("express");
const router = express.Router();
const controller = require("../controllers/roomsController");

router.post("/room", controller.enterRoom);

module.exports = router;

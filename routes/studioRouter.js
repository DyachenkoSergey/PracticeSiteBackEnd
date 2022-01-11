const express = require("express");
const router = express.Router();
const controller = require("../controllers/studioController");

router.post("/studioList", controller.studioList);

module.exports = router;

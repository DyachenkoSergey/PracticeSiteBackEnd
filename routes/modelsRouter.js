const express = require("express");
const router = express.Router();
const controller = require("../controllers/modelsController");

router.post("/modelsList", controller.modelsList);

router.get("/topModels", controller.topModels);

module.exports = router;

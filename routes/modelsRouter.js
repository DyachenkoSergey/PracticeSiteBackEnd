const express = require("express");
const router = express.Router();
const controller = require("../controllers/modelsController");

router.post("/modelsList", controller.modelsList);

router.post("/model", controller.model);

router.get("/topModels", controller.topModels);

module.exports = router;

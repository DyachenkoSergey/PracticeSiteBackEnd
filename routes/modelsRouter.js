const express = require("express");
const router = express.Router();
const controller = require("../controllers/modelsController");

router.post("/modelsList", controller.modelsList);

router.post("/model", controller.model);

router.post("/studioModels", controller.studioModels);

router.post("/editModelProfile", controller.editModelProfile);

router.post("/modelProfile", controller.modelProfile);

router.get("/topModels", controller.topModels);

module.exports = router;

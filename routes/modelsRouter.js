const express = require("express");
const router = express.Router();
const controller = require("../controllers/modelsController");

router.get("/modelsList", controller.getAllModels);
router.get("/filterModels", controller.getFilteredModels);
router.get("/topModels", controller.topModels);
router.get("/getNumberOfTabModels", controller.numberTab);
router.post("/model", controller.model);
router.post("/modelsList", controller.modelsList);
router.post("/studioModels", controller.studioModels);
router.post("/editModelProfile", controller.editModelProfile);
router.post("/modelProfile", controller.modelProfile);

module.exports = router;

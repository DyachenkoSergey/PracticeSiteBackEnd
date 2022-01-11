const User = require("../models/User");

class modelsController {
  async modelsList(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      const searchModels = models.filter((model) =>
        model.userName.includes(req.body.values)
      );

      const modelInfo = searchModels.map((item) => {
        const obj = {
          userName: item.userName,
          userId: item.userId,
        };
        return obj;
      });

      res.json(modelInfo);
    } catch (e) {
      res.status(400).json("something went wrong");
    }
  }
  async topModels(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      res.json(models);
    } catch (e) {
      res.status(400).json("something went wrong");
    }
  }
}

module.exports = new modelsController();

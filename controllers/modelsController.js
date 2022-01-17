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
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async model(req, res) {
    try {
      const { modelId } = req.body;
      const model = await User.findOne({ userId: modelId });
      const obj = {
        userName: model.userName,
        userId: model.userId,
        modelTokens: { type: Number, default: 0 },
      };
      res.json(obj);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async topModels(req, res) {
    try {
      const models = await User.find({ userRole: "MODEL" });
      res.json(models);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }
}

module.exports = new modelsController();

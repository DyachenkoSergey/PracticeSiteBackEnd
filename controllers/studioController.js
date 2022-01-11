const User = require("../models/User");

class studioController {
  async studioList(req, res) {
    try {
      const studio = await User.find({ userRole: "STUDIO" });
      res.json(studio);
    } catch (e) {
      res.status(400).json("something went wrong");
    }
  }
}

module.exports = new studioController();

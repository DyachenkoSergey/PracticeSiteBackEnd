const User = require("../models/User");

class studioController {
  async studioList(req, res) {
    try {
      const studio = await User.find({ userRole: "STUDIO" });
      res.json(studio);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }
}

module.exports = new studioController();

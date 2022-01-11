const Room = require("../models/Room");

class roomsController {
  async enterRoom(req, res) {
    try {
      const { roomId } = req.body;
      const room = await Room.findOne({ roomId });
      res.json(room);
    } catch (error) {
      res.status(400).json("something went wrong");
    }
  }
}

module.exports = new roomsController();

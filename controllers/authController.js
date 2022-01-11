const User = require("../models/User");
const Room = require("../models/Room");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const generateAccessToken = (userName, userId) => {
  const payload = {
    userId,
    userName,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const {
        name: userName,
        password: userPassword,
        email: userEmail,
        role: userRole,
      } = req.body.values;
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({ message: "registration error" });
      }
      const foundUser = await User.findOne({ userName });
      if (foundUser) {
        return res.status(400).json({ message: "Name already in use" });
      }
      const hashPassword = bcrypt.hashSync(userPassword, 7);
      const possibleRoles = ["USER", "MODEL", "STUDIO"];
      if (!possibleRoles.includes(userRole)) {
        return res.status(400).json({ message: "registration error" });
      }

      const userId = uuidv4();

      const user = new User({
        userId,
        userName,
        userEmail,
        userPassword: hashPassword,
        userRole,
      });

      if (userRole === "MODEL") {
        const room = new Room({
          roomId: userId,
        });
        await room.save();
      }
      await user.save();

      return res.json({ message: "user registered successfully" });
    } catch (e) {
      console.log(e);
      res.status(400).json("registration error");
    }
  }
  async login(req, res) {
    try {
      const { name: userName, password: userPassword } = req.body.values;
      const foundUser = await User.findOne({ userName });
      if (!foundUser) {
        return res.status(400).json(`Sorry, ${userName} not found`);
      }
      if (foundUser) {
        const validPassword = bcrypt.compareSync(
          userPassword,
          foundUser.userPassword
        );
        if (!validPassword) {
          return res.status(400).json(`incorrect password`);
        }
        const token = generateAccessToken(foundUser.userName, foundUser.userId);
        return res.json({
          userId: foundUser.userId,
          userName: foundUser.userName,
          userEmail: foundUser.userEmail,
          userTokens: foundUser.userTokens,
          userRole: foundUser.userRole,
          token,
        });
      }
    } catch (e) {
      res.status(400).json("login error");
    }
  }
  async getUser(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      res.status(400).json("something went wrong");
    }
  }
}
module.exports = new authController();

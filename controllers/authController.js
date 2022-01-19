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
        studioId,
      } = req.body.values;

      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(401).json({ message: "registration error" });
      }
      const foundUser = await User.findOne({ userName });
      if (foundUser) {
        return res.status(401).json({ message: "Name already in use" });
      }
      const registeredEmail = await User.findOne({ userEmail });
      if (registeredEmail) {
        return res.status(401).json({ message: "Email already in use" });
      }
      const hashPassword = bcrypt.hashSync(userPassword, 7);
      const possibleRoles = ["USER", "MODEL", "STUDIO"];
      if (!possibleRoles.includes(userRole)) {
        return res.status(401).json({ message: "registration error" });
      }

      const userId = uuidv4();

      const user = new User({
        userId,
        userName,
        userEmail,
        userPassword: hashPassword,
        studioId,
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
    } catch (error) {
      res.status(401).json({ message: "registration error" });
    }
  }
  async logIn(req, res) {
    try {
      const { name: userName, password: userPassword } = req.body.values;
      const foundUser = await User.findOne({ userName });
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: `Sorry, ${userName} not found` });
      }
      if (foundUser) {
        const validPassword = bcrypt.compareSync(
          userPassword,
          foundUser.userPassword
        );
        if (!validPassword) {
          return res.status(401).json({ message: `incorrect password` });
        }
        const token = generateAccessToken(foundUser.userName, foundUser.userId);
        foundUser.isOnLine = true;
        await foundUser.save();

        return res.json({
          userId: foundUser.userId,
          userName: foundUser.userName,
          userEmail: foundUser.userEmail,
          userTokens: foundUser.userTokens,
          userRole: foundUser.userRole,
          token,
        });
      }
    } catch (error) {
      res.status(401).json({ message: "login error" });
    }
  }

  async logOut(req, res) {
    try {
      const { userId } = req.body;
      const user = await User.findOne({ userId });
      user.isOnLine = false;
      await user.save();
      res.status(200).json({ message: "user logged out" });
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }

  async getUser(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(401).json({ message: "something went wrong" });
    }
  }
}
module.exports = new authController();

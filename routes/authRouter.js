const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { check } = require("express-validator");

router.post(
  "/registration",
  [
    check("userName", "username cannot be empty").notEmpty(),
    check("userName", "username must be more than two characters").isLength({
      min: 2,
      max: 15,
    }),
    check("userPassword", "password cannot be empty").notEmpty(),
    check(
      "password",
      "Password should be at least 4 symbols, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character"
    ).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,}$/),
    check("userEmail", "Email cannot be empty").notEmpty(),
    check("userEmail", "Enter a valid email").isEmail(),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", controller.getUser);

module.exports = router;

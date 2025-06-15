const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const authenticate = require("../middleware/authenticate");
const cors = require("../middleware/cors");
router.use(express.json());
router.options("*", cors.corsWithOptions, (_, res) => res.sendStatus(200));

router.post(
  "/signup",
  cors.corsWithOptions,
  [
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("name").trim().notEmpty(),
    body("role").optional().isIn(["user"]), // force “user”
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    if (req.body.role === "admin")
      return res.status(403).json({ error: "Admin registration not allowed." });

    try {
      const { email, password, name } = req.body;

      const user = await User.register(
        new User({ username: email, name, role: "user" }),
        password
      );

      passport.authenticate("local")(req, res, () =>
        res.status(201).json({
          success: true,
          message: "Registration successful",
          userId: user._id,
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", cors.corsWithOptions, (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials", info });

    req.logIn(user, { session: false }, (err) => {
      if (err) return next(err);

      const token = authenticate.getToken({ _id: user._id });
      res.json({
        success: true,
        message: "Login successful",
        accessToken: token,
        user: {
          _id: user._id,
          email: user.username,
          name: user.name,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

router.post("/logout", cors.corsWithOptions, (req, res) => {
  req.logout(() => res.status(204).end());
});

router.get(
  "/check/jwt",
  cors.corsWithOptions,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.json({ status: "JWT valid", accessToken: token, user: req.user });
  }
);

module.exports = router;

const express = require("express");
const validateBody = require("../../middlewares/validateBody.js");
const authenticate = require("../../middlewares/authenticate.js");
const { schemas } = require("../../models/User.js");
const ctrl = require("../../models/user-controller.js");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;

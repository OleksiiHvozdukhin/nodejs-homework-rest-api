const express = require("express");
const ctrl = require("../../models/contact-controller.js");
const validateBody = require("../../middlewares/validateBody.js");
const { validateField } = require("../../middlewares/validateField.js");
const isValidId = require("../../middlewares/isValidId.js");
const { schemas } = require("../../models/Сontact.js");
const authenticate = require("../../middlewares/authenticate.js");

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:id", authenticate, isValidId, ctrl.getContactById);

router.post(
  "/",
  authenticate,
  validateField,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateField,
  validateBody(schemas.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);

router.delete("/:id", authenticate, isValidId, ctrl.removeContact);

module.exports = router;

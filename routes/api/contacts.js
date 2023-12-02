const express = require("express");
const contacts = require("../../models/contact-controller.js");
const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const router = express.Router();

const addSchema = Joi.object({
  name: Joi.string()
    .required()
    .error(new Error("missing required: Name field")),
  email: Joi.string()
    .required()
    .error(new Error("missing required: Email field")),
  phone: Joi.string()
    .required()
    .error(new Error("missing required: Phone field")),
  favorite: Joi.boolean()
    .default(false)
    .error(new Error("missing required: Phone field")),
});

const HttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

router.get("/", async (req, res) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} - is not valid ID!`);
      error.status = 400;
      throw error;
    }

    const result = await contacts.getContactById(contactId);

    if (!result) {
      const error = new Error("Not found!");
      error.status = 404;
      throw error;
    }

    res.json(result);
  } catch (error) {
    const { status = 500, message = "Server error" } = error;
    res.status(status).json({
      message,
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} - is not valid ID!`);
      error.status = 400;
      throw error;
    }
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "missing fields");
    }
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} - is not valid ID!`);
      error.status = 400;
      throw error;
    }

    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "Delete success" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!isValidObjectId(contactId)) {
      const error = new Error(`${contactId} - is not valid ID!`);
      error.status = 400;
      throw error;
    }

    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!Object.prototype.hasOwnProperty.call(req.body, "favorite")) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const result = await contacts.updateStatusContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

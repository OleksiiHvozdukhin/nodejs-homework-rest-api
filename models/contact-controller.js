const Contact = require("../models/Contact.js");

const listContacts = async () => {
  const result = await Contact.find();
  return result;
};

const getContactById = async (contactId) => {
  const result = await Contact.findById(contactId);
  return result || null;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findById(contactId, body, {
    new: true,
    runValidators: true,
  });
  return result || null;
};

const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndDelete(contactId);
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { favorite: body.favorite },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};

const { nanoid } = require("nanoid");
const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("models", "contacts.json");

const HttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const listContacts = async () => {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const newContacts = {
    name,
    email,
    phone,
    id: nanoid(),
  };
  contacts.push(newContacts);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContacts;
};

const updateContact = async (contactId, body) => {
  if (!body) {
    throw HttpError(404, "Not Found");
  }

  const id = String(contactId);
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = {
    id,
    ...body,
  };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index] || null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

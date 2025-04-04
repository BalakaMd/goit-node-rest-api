import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json');

async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf-8').catch(() => '[]');
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find(item => item.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);

  if (index === -1) {
    return null;
  }

  const [removedContact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateContact(contactId, updatedFields) {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);

  if (index === -1) {
    return null;
  }

  const updatedContact = { ...contacts[index], ...updatedFields };
  contacts[index] = updatedContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return updatedContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

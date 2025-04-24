import Contact from '../models/contact.js';

async function listContacts() {
  const contacts = await Contact.findAll();
  return contacts;
}

async function getContactById(contactId) {
  const contact = await Contact.findByPk(contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contact = await Contact.findByPk(contactId);
  
  if (!contact) {
    return null;
  }
  
  await contact.destroy();
  return contact;
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({
    name,
    email,
    phone,
  });
  
  return newContact;
}

async function updateContact(contactId, updatedFields) {
  const contact = await Contact.findByPk(contactId);
  
  if (!contact) {
    return null;
  }
  
  await contact.update(updatedFields);
  return contact;
}

async function updateStatusContact(contactId, favorite) {
  const contact = await Contact.findByPk(contactId);
  
  if (!contact) {
    return null;
  }
  
  await contact.update({ favorite });
  return contact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

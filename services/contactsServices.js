import Contact from '../models/contact.js';

async function listContacts(userId) {
  const contacts = await Contact.findAll({
    where: { owner: userId }
  });
  return contacts;
}

async function getContactById(contactId, userId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: userId
    }
  });
  return contact || null;
}

async function removeContact(contactId, userId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: userId
    }
  });
  
  if (!contact) {
    return null;
  }
  
  await contact.destroy();
  return contact;
}

async function addContact(name, email, phone, userId) {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    owner: userId
  });
  
  return newContact;
}

async function updateContact(contactId, updatedFields, userId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: userId
    }
  });
  
  if (!contact) {
    return null;
  }
  
  await contact.update(updatedFields);
  return contact;
}

async function updateStatusContact(contactId, favorite, userId) {
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      owner: userId
    }
  });
  
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

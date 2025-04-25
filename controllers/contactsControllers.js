import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const contacts = await contactsService.listContacts(userId);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const contact = await contactsService.getContactById(id, userId);

    if (!contact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const deletedContact = await contactsService.removeContact(id, userId);

    if (!deletedContact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { id: userId } = req.user;
    const newContact = await contactsService.addContact(name, email, phone, userId);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, 'Body must have at least one field');
    }

    const { id } = req.params;
    const { id: userId } = req.user;
    const updatedContact = await contactsService.updateContact(id, req.body, userId);

    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const { id: userId } = req.user;
    
    const updatedContact = await contactsService.updateStatusContact(id, favorite, userId);

    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
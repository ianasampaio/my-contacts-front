/* eslint-disable import/no-anonymous-default-export */
import HttpClient from "./utils/HttpClient";

class ContactsService {
  constructor() {
    this.HttpClient = new HttpClient('http://localhost:3001');
  }

  async listContacts(orderBy = 'asc') {
    return this.HttpClient.get(`/contacts?orderBy=${orderBy}`);
  }

  async createContact(contact) {
    return this.HttpClient.post('/contacts', {body: contact});
  }
}

export default new ContactsService();

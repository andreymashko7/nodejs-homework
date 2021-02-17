import fs from "fs/promises";
import path from "path";
import shortid from "shortid";
import { handleError } from "./lib/handlerror.js";

const contactsPath = path.join("./db/contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const result = JSON.parse(data);
    console.table(result);
    return result;
  } catch (e) {
    handleError(e);
  }
}

export async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const result = JSON.parse(data).find(({ id }) => id === contactId);
    console.log(`Найден контакт по id ${contactId}`);
    console.table(result);
    return;
  } catch (e) {
    handleError(e);
  }
}

export async function removeContact(contactId) {
  try {
    const data = await listContacts();
    const result = data.filter((data) => data.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(result));

    console.log(`Удалили контакт с id ${contactId}`);
    console.table(result);
    listContacts();
    return;
  } catch (e) {
    handleError(e);
  }
}

export async function addContact(name, email, phone) {
  try {
    const data = await listContacts();
    const newContact = { name, email, phone, id: shortid() };
    const updatedContacts = [...data, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    console.log(`Добавлен контакт ${name}`);
    listContacts();
    return;
  } catch (e) {
    handleError(e);
  }
}

// # Получаем и выводим весь список контакстов в виде таблицы (console.table)
// node index.js --action="list"

// # Получаем контакт по id
// node index.js --action="get" --id=5

// # Добавялем контакт
// node index.js --action="add" --name="Mango" --email="mango@gmail.com" --phone="322-22-22"

// # Удаляем контакт
// node index.js --action="remove" --id=3

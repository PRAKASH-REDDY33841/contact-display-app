import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Form from "./components/Form";
import ContactList from "./components/ContactList";
import Pagination from "./components/Pagination";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // contacts per page
  const [total, setTotal] = useState(0);

  // Use localhost fallback if environment variable is missing
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch contacts from backend
  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/contacts?page=${page}&limit=${limit}`);
      setContacts(res.data.contacts);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching contacts:", err.message);
    }
  }, [page, limit, BASE_URL]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts, page]);

  // Add a new contact
  const addContact = async (contact) => {
    try {
      await axios.post(`${BASE_URL}/contacts`, contact);
      setPage(1); // reset to first page to show newly added contact
      fetchContacts();
    } catch (err) {
      console.error("Error adding contact:", err.message);
    }
  };

  // Delete a contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/contacts/${id}`);
      // If the last contact on the page is deleted, go to previous page
      if (contacts.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchContacts();
      }
    } catch (err) {
      console.error("Error deleting contact:", err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Contact Book</h1>
      <Form onAdd={addContact} />
      <ContactList contacts={contacts} onDelete={deleteContact} />
      <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
    </div>
  );
}

export default App;

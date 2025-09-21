// src/components/Form.js
import React, { useState } from "react";
import './Form.css';

function Form({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({}); // store validation errors

  const validate = () => {
    const newErrors = {};

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name should only contain alphabets and spaces.";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required.";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd({ name, email, phone });
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className = "input"
          style={styles.input}
        />
        {errors.name && <p style={styles.error}>{errors.name}</p>}
      </div>

      <div style={styles.field}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          className = "input"
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}
      </div>

      <div style={styles.field}>
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
          className = "input"
          maxLength="10"
        />
        {errors.phone && <p style={styles.error}>{errors.phone}</p>}
      </div>

      <button type="submit" style={styles.button} className = "button">Add Contact</button>
    </form>
  );
}

const styles = {
  form: { margin: "20px 0", display: "flex", flexDirection: "column", gap: "15px" },
  field: { display: "flex", flexDirection: "column" },
  input: { padding: "8px", flex: 1, border: "1px solid #ccc", borderRadius: "4px" },
  button: { padding: "10px 16px", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red", fontSize: "12px", marginTop: "5px" }
};

export default Form;
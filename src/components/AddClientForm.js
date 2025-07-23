import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../constants/api';
import './ClientManagement.css';
import './AddClient.css';

function AddClientForm() {
  const [form, setForm] = useState({ username: '', mobile: '', categoryId: '', subTypeId: '' });
  const [files, setFiles] = useState([]);

  const caseTypes = {
    Civil: ['Property Disputes', 'Contract Disputes', 'Family Law', 'Consumer Protection'],
    Criminal: ['Theft', 'Assault', 'Fraud', 'Murder'],
    Corporate: ['Mergers & Acquisitions', 'Intellectual Property', 'Compliance'],
    Constitutional: ['Fundamental Rights', 'Writ Petitions'],
    Labor: ['Wage Disputes', 'Wrongful Termination'],
    Tax: ['Income Tax', 'GST'],
    Environmental: ['Pollution Control', 'Forest Rights'],
    Others: ['Cyber Law', 'Education Law', 'Banking Law']
  };

  // Generate category ID based on its index (starting from 1)
  const categoryIdMap = Object.keys(caseTypes).reduce((acc, cat, idx) => {
    acc[cat] = idx + 1;
    return acc;
  }, {});

  // Generate subType ID map
  let subTypeId = 1;
  const subTypeIdMap = {};
  Object.entries(caseTypes).forEach(([category, subTypes]) => {
    subTypes.forEach(sub => {
      subTypeIdMap[sub] = subTypeId++;
    });
  });

  const handleFileChange = (e) => setFiles([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      username: form.username,
      mobile: form.mobile,
      categoryId: categoryIdMap[form.categoryId],
      subTypeId: subTypeIdMap[form.subTypeId]
    };

    const formData = new FormData();
    formData.append('client', JSON.stringify(dto));
    files.forEach(file => formData.append('files', file));

    try {
      const token = localStorage.getItem('token');
      await axios.post(API.ADD_CLIENT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Client added successfully');
      setForm({ username: '', mobile: '', categoryId: '', subTypeId: '' });
      setFiles([]);
    } catch (error) {
      alert('Failed to add client');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-client-form">
      <h2>Add New Client</h2>

      <input
        type="text"
        placeholder="Name"
        required
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="number"
        placeholder="Mobile"
        required
        value={form.mobile}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
      />

      <select
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value, subTypeId: '' })}
        required
      >
        <option value="">-- Select Category --</option>
        {Object.keys(caseTypes).map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {form.categoryId && (
        <select
          value={form.subTypeId}
          onChange={(e) => setForm({ ...form, subTypeId: e.target.value })}
          required
        >
          <option value="">-- Select Sub-Type --</option>
          {caseTypes[form.categoryId].map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      )}

      <input
        type="file"
        multiple
        onChange={handleFileChange}
      />

      <button type="submit">Add Client</button>
    </form>
  );
}

export default AddClientForm;

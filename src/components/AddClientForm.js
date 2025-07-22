import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../constants/api';
import './ClientManagement.css';
import './AddClient.css';

function AddClientForm() {
  const [form, setForm] = useState({ username: '', mobile: '', categoryId: '', subTypeId: '' });
  const [files, setFiles] = useState([]);

  const categoryMap = {
    'Civil': 1, 'Criminal': 2, 'Corporate': 3, 'Constitutional': 4,
    'Labor': 5, 'Tax': 6, 'Environmental': 7, 'Others': 8
  };

  const subTypeMap = {
    'Property Disputes': 1, 'Contract Disputes': 2, 'Family Law': 3, 'Consumer Protection': 4,
    'Theft': 5, 'Assault': 6, 'Fraud': 7, 'Murder': 8, 'Mergers & Acquisitions': 9,
    'Intellectual Property': 10, 'Compliance': 11, 'Fundamental Rights': 12, 'Writ Petitions': 13,
    'Wage Disputes': 14, 'Wrongful Termination': 15, 'Income Tax': 16, 'GST': 17,
    'Pollution Control': 18, 'Forest Rights': 19, 'Cyber Law': 20, 'Education Law': 21, 'Banking Law': 22
  };

  const handleFileChange = (e) => setFiles([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      username: form.username,
      mobile: form.mobile,
      categoryId: categoryMap[form.categoryId],
      subTypeId: subTypeMap[form.subTypeId]
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
        {Object.keys(categoryMap).map(cat => (
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
          {Object.keys(subTypeMap)
            .filter(sub => subTypeMap[sub].toString().startsWith(categoryMap[form.categoryId]))
            .map(sub => (
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

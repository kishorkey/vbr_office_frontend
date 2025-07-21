import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants/api';
import './ClientManagement.css';

function ClientManagement() {
  const [caseCategory, setCaseCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientData, setClientData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5); // can be made dynamic later

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

  // 🔹 Fetch all clients initially
  const fetchAllClients = async (page = 0) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API.GET_ClientS, {
        params: { page, size: pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setClientData(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Failed to fetch all clients:', error);
    }
  };

  // 🔹 Fetch clients based on filters
  const fetchFilteredClients = async (page = 0) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API.FILTER_CLIENTS, {
        params: {
          name: clientName,
          category: caseCategory,
          subtype: subType,
          page,
          size: pageSize
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setClientData(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Failed to fetch filtered clients:', error);
    }
  };

  // 🔹 Detect search/filter changes
  const handleSearch = () => {
    if (clientName || caseCategory || subType) {
      fetchFilteredClients(0);
    } else {
      fetchAllClients(0);
    }
  };

  useEffect(() => {
    fetchAllClients(0);
  }, []);

  const downloadFile = (file) => {
    const byteCharacters = atob(file.data);
    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.fileType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h2 className="title">Client Management</h2>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <select value={caseCategory} onChange={(e) => { setCaseCategory(e.target.value); setSubType(''); }}>
          <option value="">-- Select Category --</option>
          {Object.keys(caseTypes).map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

        {caseCategory && (
          <select value={subType} onChange={(e) => setSubType(e.target.value)}>
            <option value="">-- Select Sub-Type --</option>
            {caseTypes[caseCategory].map((sub, idx) => (
              <option key={idx} value={sub}>{sub}</option>
            ))}
          </select>
        )}

        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="clients-grid">
        {clientData.map((client) => (
          <div key={client.userId} className="client-card">
            <h3>{client.username}</h3>
            <p><strong>Contact:</strong> {client.number}</p>
            <p><strong>Category:</strong> {client.categoryName || client.category?.categoryName || 'N/A'}</p>
            <p><strong>Sub-Type:</strong> {client.subtypeName || client.subType?.name || 'N/A'}</p>

            <h4>Files</h4>
            {client.files?.length > 0 ? (
              <ul className="files-list">
                {client.files.map((file) => (
                  <li key={file.id}>
                    📎 {file.fileName}
                    <button onClick={() => downloadFile(file)} className="download-btn">Download</button>
                  </li>
                ))}
              </ul>
            ) : <p>No files available.</p>}
          </div>
        ))}
      </div>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                if (clientName || caseCategory || subType) {
                  fetchFilteredClients(i);
                } else {
                  fetchAllClients(i);
                }
              }}
              className={currentPage === i ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientManagement;

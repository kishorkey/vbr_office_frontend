import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants/api';
import './ClientManagement.css';

function ClientManagement() {
  const [clientName, setClientName] = useState('');
  const [caseCategory, setCaseCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [clientData, setClientData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

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

  const fetchClients = async (page = 0) => {
    const token = localStorage.getItem('token');
    const params = {
      name: clientName || null,
      category: caseCategory || null,
      subtype: subType || null,
      page,
      size: pageSize,
    };

    try {
      const response = await axios.get(API.FILTER_CLIENTS, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClientData(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (err) {
      console.error('Client fetch failed', err);
    }
  };

  const downloadFile = (file) => {
    const byteCharacters = atob(file.data);
    const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
    const blob = new Blob([byteArray], { type: file.fileType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchClients(0);
  }, []);

  return (
    <div className="client-management">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <select value={caseCategory} onChange={(e) => { setCaseCategory(e.target.value); setSubType(''); }}>
          <option value="">-- Select Category --</option>
          {Object.keys(caseTypes).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {caseCategory && (
          <select value={subType} onChange={(e) => setSubType(e.target.value)}>
            <option value="">-- Select Sub-Type --</option>
            {caseTypes[caseCategory].map((sub, i) => (
              <option key={i} value={sub}>{sub}</option>
            ))}
          </select>
        )}

        <button onClick={() => fetchClients(0)}>Search</button>
      </div>

      <div className="clients-grid">
        {clientData.map(client => (
          <div className="client-card" key={client.userId}>
  <div className="client-header">
    <h3>{client.username}</h3>
    <span className="client-contact">📞 {client.number}</span>
  </div>

  <div className="client-info">
    <p><strong>Category:</strong> {client.categoryName || 'N/A'}</p>
    <p><strong>Sub-Type:</strong> {client.subtypeName || 'N/A'}</p>
  </div>

  <div className="client-files">
    <div className="files-header">
  <span className="icon">📁</span>
  <span>Files</span>
</div>
    {client.files?.length ? (
      <div className="file-list">
  {client.files.map(file => (
    <div className="file-item" key={file.id}>
      📎 {file.fileName}
      <button className="download-btn" onClick={() => downloadFile(file)}>Download</button>
    </div>
  ))}
</div>
    ) : (
      <p className="no-files">No files</p>
    )}
  </div>
</div>

        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={i === currentPage ? 'active' : ''}
            onClick={() => fetchClients(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ClientManagement;

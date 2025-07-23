import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants/api';
import './ClientManagement.css';
import { FaEdit } from "react-icons/fa";
import api from '../utils/axiosConfig';

function ClientManagement() {
  const [clientName, setClientName] = useState('');
  const [caseCategory, setCaseCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [clientData, setClientData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingClient, setEditingClient] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [filesMarkedForDeletion, setFilesMarkedForDeletion] = useState([]);
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
      const response = await api.get(API.FILTER_CLIENTS, {
        params,
      });

      setClientData(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (err) {
      console.error('Client fetch failed', err);
    }
  };

  useEffect(() => {
    fetchClients(0);
  }, []);

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

  const handleEditClick = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(API.GET_CLIENT_byID, {
        params: { Id: userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const client = response.data;
      setEditingClient({
        ...client,
        editableUsername: client.username,
        editableNumber: client.number,
        editableCategory: client.category?.categoryName || '',
        editableSubType: client.subType?.name || '',
      });
      setNewFiles([]);
    } catch (err) {
      console.error('Error fetching client for edit', err);
    }
  };

  const handleFileUpload = (e) => {
    setNewFiles([...newFiles, ...e.target.files]);
  };

const handleFileDelete = (fileId) => {
  const updatedFiles = editingClient.files.filter(file => file.id !== fileId);
  setEditingClient({ ...editingClient, files: updatedFiles });

  setFilesMarkedForDeletion(prev => [...prev, fileId]);
};

//   const handleFileDelete = async (fileId) => {
//   const deletedBy = localStorage.getItem('Name');
//   const token = localStorage.getItem('token');

//   try {
//     await api.delete(`http://localhost:8080/test/getFileById`, {
//       params: { id: fileId, deletedBy },
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     // Remove file from editingClient's file list after successful deletion
//     const updatedFiles = editingClient.files.filter(file => file.id !== fileId);
//     setEditingClient({ ...editingClient, files: updatedFiles });
//     alert('File deleted successfully');
//     window.location.reload();
//   } catch (error) {
//     console.error('Failed to delete file:', error);
//     alert('Failed to delete file');
//   }
// };

const handleUpdate = async () => {
  const token = localStorage.getItem('token');
  const deletedBy = localStorage.getItem('Name');

  try {
    // First, delete the files marked for deletion
    for (const fileId of filesMarkedForDeletion) {
      await api.delete(`http://localhost:8080/test/getFileById`, {
        params: { id: fileId, deletedBy },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // TODO: Add update client info + new file upload logic here if needed

    alert('Client updated successfully');
    setEditingClient(null);
    setFilesMarkedForDeletion([]);
    setNewFiles([]);
    fetchClients(currentPage); // Refresh client list
  } catch (error) {
    console.error('Update failed:', error);
    alert('Failed to update client');
  }
};

const handleModalClose = () => {
  setEditingClient(null);
  setNewFiles([]);
  setFilesMarkedForDeletion([]);
};

  return (
    <div className="client-management">
      {/* Search Filters */}
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

      {/* Client Cards */}
      <div className="clients-grid">
        {clientData.map(client => (
          <div className="client-card" key={client.userId}>
            <span className="edit-icon" onClick={() => handleEditClick(client.userId)}><FaEdit /></span>
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
                <span className="icon">📁</span><span>Files</span>
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

      {/* Pagination */}
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

      {/* Edit Modal */}
      {editingClient && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>Edit Client</h2>
            <input
              value={editingClient.editableUsername}
              onChange={(e) => setEditingClient({ ...editingClient, editableUsername: e.target.value })}
            />
            <input
              value={editingClient.editableNumber}
              onChange={(e) => setEditingClient({ ...editingClient, editableNumber: e.target.value })}
            />
            <select
              value={editingClient.editableCategory}
              onChange={(e) => setEditingClient({
                ...editingClient,
                editableCategory: e.target.value,
                editableSubType: '',
              })}
            >
              <option value="">-- Select Category --</option>
              {Object.keys(caseTypes).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={editingClient.editableSubType}
              onChange={(e) => setEditingClient({ ...editingClient, editableSubType: e.target.value })}
            >
              <option value="">-- Select Sub-Type --</option>
              {(caseTypes[editingClient.editableCategory] || []).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Files */}
            <div className="file-list" style={{ marginTop: '15px' }}>
              <h4>Files</h4>
              {editingClient.files?.length ? editingClient.files.map(file => (
                <div className="file-item-modal" key={file.id}>
                  📎 {file.fileName}
                  <span
                    className="delete-icon"
                    title="Delete File"
                    onClick={() => handleFileDelete(file.id)}
                  >🗑️</span>
                </div>
              )) : <p className="no-files">No files</p>}
            </div>

            {/* File Upload */}
            <input type="file" multiple onChange={handleFileUpload} style={{ marginTop: '10px' }} />
            {newFiles.length > 0 && (
              <p style={{ fontSize: '14px' }}>
                <strong>New Files:</strong> {Array.from(newFiles).map(file => file.name).join(', ')}
              </p>
            )}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleModalClose}>Cancle</button>
             <button className="save-btn" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientManagement;

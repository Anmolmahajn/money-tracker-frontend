import React, { useState } from 'react';
import { csvAPI } from '../services/api';
import { Upload, Download } from 'lucide-react';

function CSVUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await csvAPI.upload(formData);
      alert(`Successfully imported ${response.data.length} transactions`);
      onUploadComplete();
      setFile(null);
    } catch (error) {
      alert('Error uploading CSV');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await csvAPI.getTemplate();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template.csv';
      a.click();
    } catch (error) {
      alert('Error downloading template');
    }
  };

  return (
    <div className="card">
      <h2>Bulk Import from CSV</h2>
      
      <div className="csv-upload">
        <button onClick={downloadTemplate} className="btn btn-secondary">
          <Download size={20} /> Download Template
        </button>

        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          style={{ margin: '20px 0' }}
        />

        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="btn btn-primary"
        >
          <Upload size={20} /> {uploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>
    </div>
  );
}

export default CSVUpload;

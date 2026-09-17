import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { UploadCloud, FileText, CheckCircle, Database, Settings2 } from 'lucide-react';
import './ImportDashboard.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const ImportDashboard = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sourceType, setSourceType] = useState('YAHAV_CREDIT');
  const [globalActor, setGlobalActor] = useState('מושלמת');
  const [globalMonth, setGlobalMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [uniqueTopics, setUniqueTopics] = useState([]);
  const [uniquePaymentMethods, setUniquePaymentMethods] = useState([]);

  useEffect(() => {
    // Fetch unique topics from DB
    axios.get('/finance/api/v1/import/topics')
      .then(res => setUniqueTopics(res.data))
      .catch(err => console.error("Error fetching topics:", err));
      
    // Fetch unique payment methods from DB
    axios.get('/finance/api/v1/import/payment-methods')
      .then(res => setUniquePaymentMethods(res.data))
      .catch(err => console.error("Error fetching payment methods:", err));
  }, []);

  const columnDefs = useMemo(() => [
    { field: 'txnMonth', headerName: 'Month', editable: true },
    { field: 'category', headerName: 'Category', editable: true, flex: 2 },
    { field: 'amount', headerName: 'Amount', editable: true, type: 'numericColumn' },
    { field: 'actor', headerName: 'Actor', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['מושלמת', 'בית', 'איגור'] } },
    { field: 'topic', headerName: 'Topic', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['', ...uniqueTopics] } },
    { field: 'paymentMethod', headerName: 'Payment Method', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['', ...uniquePaymentMethods] } },
    { field: 'sourceName', headerName: 'Source', editable: true },
    { field: 'txnType', headerName: 'Type', editable: true }
  ], [uniqueTopics, uniquePaymentMethods]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('sourceType', sourceType);

    try {
      const response = await axios.post('/finance/api/v1/import/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const hebrewMonths = ["", "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
      
      const dataWithGlobals = response.data.map(row => {
        const out = { ...row, actor: globalActor };
        if (globalMonth) {
           out.txnMonth = `${globalMonth}-01`;
           const m = parseInt(globalMonth.split('-')[1], 10);
           out.sheetName = hebrewMonths[m];
        }
        return out;
      });
      setRowData(dataWithGlobals);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload and parse file.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyGlobalActor = () => {
    setRowData(prev => prev.map(row => ({ ...row, actor: globalActor })));
  };

  const handleSaveToDatabase = async () => {
    if (rowData.length === 0) return;
    setSaving(true);
    try {
      const response = await axios.post('/finance/api/v1/import/save', rowData);
      alert(response.data.message || 'Saved successfully!');
      setRowData([]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving transactions:', error);
      alert('Failed to save transactions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="import-dashboard-wrapper">
      <div className="import-dashboard-header">
        <div className="header-title-section">
          <div className="icon-wrapper">
            <UploadCloud size={28} />
          </div>
          <div>
            <h2>Import Transactions</h2>
            <p className="subtitle">Upload, parse, and verify bank statements before syncing to the database.</p>
          </div>
        </div>
      </div>

      <div className="import-controls-card">
        <div className="settings-section">
          <div className="section-heading">
            <Settings2 size={18} />
            <h3>Import Settings</h3>
          </div>
          
          <div className="controls-grid">
            <div className="input-group">
              <label>Data Source</label>
              <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="modern-select">
                <option value="YAHAV_CREDIT">אשראי יהב (Yahav Credit)</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Global Actor (Default)</label>
              <select 
                value={globalActor} 
                onChange={(e) => {
                  const newActor = e.target.value;
                  setGlobalActor(newActor);
                  // Apply to existing table on the fly
                  setRowData(prev => prev.map(row => ({ ...row, actor: newActor })));
                }} 
                className="modern-select"
              >
                <option value="מושלמת">מושלמת</option>
                <option value="בית">בית</option>
                <option value="איגור">איגור</option>
              </select>
            </div>

            <div className="input-group">
              <label>Global Month</label>
              <input 
                type="month" 
                value={globalMonth} 
                onChange={(e) => {
                  const newMonth = e.target.value;
                  setGlobalMonth(newMonth);
                  if (newMonth) {
                    const m = parseInt(newMonth.split('-')[1], 10);
                    const hebrewMonths = ["", "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
                    setRowData(prev => prev.map(row => ({ 
                      ...row, 
                      txnMonth: `${newMonth}-01`,
                      sheetName: hebrewMonths[m]
                    })));
                  }
                }}
                className="modern-select"
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="upload-section">
          <div className="file-upload-wrapper">
            <input type="file" id="file-upload" className="file-input-hidden" onChange={handleFileChange} accept=".pdf" />
            <label htmlFor="file-upload" className={`file-drop-zone ${selectedFile ? 'has-file' : ''}`}>
              <FileText size={24} className="file-icon" />
              <span className="file-name">
                {selectedFile ? selectedFile.name : 'Click to browse PDF statement...'}
              </span>
            </label>
          </div>
          
          <button onClick={handleUpload} disabled={!selectedFile || uploading} className="btn-primary">
            {uploading ? (
              <span className="flex-center">Processing...</span>
            ) : (
              <span className="flex-center"><UploadCloud size={18} /> Parse File</span>
            )}
          </button>
        </div>
      </div>

      {rowData.length > 0 && (
        <div className="preview-card">
          <div className="preview-header">
            <h3><CheckCircle size={18} className="success-icon" /> Preview Data ({rowData.length} records)</h3>
            <button onClick={handleSaveToDatabase} disabled={saving} className="btn-success">
              {saving ? 'Saving...' : <><Database size={18} /> Save to Database</>}
            </button>
          </div>
          <div className="ag-theme-quartz grid-wrapper">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              getRowId={(params) => params.data.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportDashboard;

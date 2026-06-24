import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import LineChartRenderer from './LineChartRenderer';
import PieChartRenderer from './PieChartRenderer';
import BarChartRenderer from './BarChartRenderer';
import { GRAPH_PRESETS } from '../utils/GraphPresets';
import './TransactionGraph.css';

export default function TransactionGraph() {
    const [data, setData] = useState([]);
    
    // GraphConfiguration state based on data-model.md
    const [config, setConfig] = useState({
        graphType: 'LINE',
        xAxisField: 'txnMonth',
        yAxisField: 'amount',
        breakdownField: 'none',
        multiCheckSelection: [],
        startDate: '',
        endDate: '',
        selectedYears: []
    });

    const timeFields = ['txnMonth', 'txnDate'];
    const categoricalFields = ['category', 'txnType', 'paymentMethod', 'actor', 'sourceName'];
    const allFields = [...timeFields, ...categoricalFields];

    useEffect(() => {
        axios.get('/finance/transactions/v1?size=10000')
             .then(res => setData(res.data.content || []))
             .catch(err => console.error(err));
    }, []);

    // Extract unique years from all data
    const availableYears = useMemo(() => {
        const years = new Set();
        data.forEach(txn => {
            const y = txn.txnYear || (txn.txnMonth ? txn.txnMonth.substring(0,4) : null);
            if (y) years.add(y.toString());
        });
        return Array.from(years).sort((a,b) => b.localeCompare(a)); // Descending
    }, [data]);

    // Filter data by date range and selected years if provided
    const filteredData = useMemo(() => {
        let filtered = data;
        
        if (config.selectedYears && config.selectedYears.length > 0) {
            filtered = filtered.filter(txn => {
                const y = txn.txnYear?.toString() || (txn.txnMonth ? txn.txnMonth.substring(0,4) : null);
                return config.selectedYears.includes(y);
            });
        }
        
        if (config.startDate) {
            filtered = filtered.filter(txn => txn.txnDate && txn.txnDate >= config.startDate);
        }
        if (config.endDate) {
            filtered = filtered.filter(txn => txn.txnDate && txn.txnDate <= config.endDate);
        }
        return filtered;
    }, [data, config.startDate, config.endDate, config.selectedYears]);

    // Get unique values for the selected X-Axis field to display in multi-select
    const uniqueGroupValues = useMemo(() => {
        if (!filteredData || !filteredData.length) return [];
        const unique = new Set();
        filteredData.forEach(txn => {
            const val = txn[config.xAxisField];
            if (val) unique.add(val);
        });
        return Array.from(unique).sort();
    }, [filteredData, config.xAxisField]);

    const handleMultiCheck = (val) => {
        const current = [...config.multiCheckSelection];
        if (current.includes(val)) {
            setConfig({ ...config, multiCheckSelection: current.filter(item => item !== val) });
        } else {
            setConfig({ ...config, multiCheckSelection: [...current, val] });
        }
    };

    const handleYearToggle = (year) => {
        const current = [...(config.selectedYears || [])];
        if (current.includes(year)) {
            setConfig({ ...config, selectedYears: current.filter(y => y !== year) });
        } else {
            setConfig({ ...config, selectedYears: [...current, year] });
        }
    };

    const handleGraphTypeChange = (newType) => {
        let newXAxis = config.xAxisField;
        if (newType === 'LINE' && !timeFields.includes(newXAxis)) {
            newXAxis = 'txnMonth'; // Default to time for line charts
        }
        setConfig({ ...config, graphType: newType, xAxisField: newXAxis, multiCheckSelection: [] });
    };

    const isTimeAxis = timeFields.includes(config.xAxisField);
    const availableXAxisFields = config.graphType === 'LINE' ? timeFields : allFields;

    return (
        <div className="graph-container">
            <div className="graph-header">
                <h2>Transaction Trends</h2>
            </div>
            
            <div className="graph-presets" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {GRAPH_PRESETS.map(preset => (
                    <button 
                        key={preset.id} 
                        onClick={() => setConfig({ ...config, ...preset.config, startDate: '', endDate: '' })}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #cbd5e1',
                            borderRadius: '20px',
                            background: config.xAxisField === preset.config.xAxisField && config.graphType === preset.config.graphType ? '#e0f2fe' : '#f8fafc',
                            color: '#0f172a',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            <div className="graph-body">
                <div className="graph-controls">
                    {availableYears.length > 0 && (
                        <div className="control-group">
                            <label>Filter by Year:</label>
                            <div className="year-pills">
                                {availableYears.map(year => {
                                    const isSelected = config.selectedYears.includes(year);
                                    return (
                                        <button
                                            key={year}
                                            onClick={() => handleYearToggle(year)}
                                            className={`year-pill ${isSelected ? 'active' : ''}`}
                                        >
                                            {year}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="control-group">
                        <label>Graph Type:</label>
                        <select 
                            value={config.graphType} 
                            onChange={(e) => handleGraphTypeChange(e.target.value)}
                        >
                            <option value="LINE">Line Chart</option>
                            <option value="PIE">Pie Chart</option>
                            <option value="BAR">Bar Chart</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label>X-Axis (Group By):</label>
                        <select 
                            value={config.xAxisField} 
                            onChange={(e) => setConfig({ ...config, xAxisField: e.target.value, multiCheckSelection: [] })}
                        >
                            {availableXAxisFields.map(field => (
                                <option key={field} value={field}>{field}</option>
                            ))}
                        </select>
                    </div>

                    {config.graphType === 'LINE' && (
                        <div className="control-group">
                            <label>Breakdown By:</label>
                            <select 
                                value={config.breakdownField} 
                                onChange={(e) => setConfig({ ...config, breakdownField: e.target.value })}
                            >
                                <option value="none">None (Total)</option>
                                {categoricalFields.map(field => (
                                    <option key={field} value={field}>{field}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isTimeAxis && (
                        <>
                            <div className="control-group">
                                <label>Start Date:</label>
                                <input 
                                    type="date"
                                    value={config.startDate}
                                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="control-group">
                                <label>End Date:</label>
                                <input 
                                    type="date"
                                    value={config.endDate}
                                    onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                                    style={{ padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                                />
                            </div>
                        </>
                    )}

                    <div className="control-group">
                        <label>Y-Axis (Aggregate):</label>
                        <select 
                            value={config.yAxisField} 
                            onChange={(e) => setConfig({ ...config, yAxisField: e.target.value })}
                        >
                            <option value="amount">amount</option>
                        </select>
                    </div>

                    {(config.graphType === 'PIE' || config.graphType === 'BAR') && uniqueGroupValues.length > 0 && (
                        <div className="control-group multi-select">
                            <label>Filter {config.xAxisField}s:</label>
                            <div className="checkbox-list" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem', background: 'white' }}>
                                {uniqueGroupValues.map(val => (
                                    <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <input 
                                            type="checkbox" 
                                            id={`chk-${val}`}
                                            checked={config.multiCheckSelection.length === 0 || config.multiCheckSelection.includes(val)}
                                            onChange={() => handleMultiCheck(val)}
                                        />
                                        <label htmlFor={`chk-${val}`} style={{ fontWeight: 'normal', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
                                            {val}
                                        </label>
                                    </div>
                                ))}
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                    (All selected if none checked)
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="chart-wrapper">
                    {config.graphType === 'LINE' && <LineChartRenderer data={filteredData} config={config} />}
                    {config.graphType === 'PIE' && <PieChartRenderer data={filteredData} config={config} />}
                    {config.graphType === 'BAR' && <BarChartRenderer data={filteredData} config={config} />}
                    {config.graphType !== 'LINE' && config.graphType !== 'PIE' && config.graphType !== 'BAR' && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                            {config.graphType} Chart is not implemented yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

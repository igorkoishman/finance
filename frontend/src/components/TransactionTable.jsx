import { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import axios from 'axios';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TransactionTable() {
    const [allData, setAllData] = useState([]);
    const [viewType, setViewType] = useState('expense'); // 'income' or 'expense'
    
    // Checkbox states (using Sets for fast lookup). If empty, implies "Select All"
    const [selectedYears, setSelectedYears] = useState(new Set());
    const [selectedMonths, setSelectedMonths] = useState(new Set());

    useEffect(() => {
        const params = new URLSearchParams();
        if (viewType) params.append('type', viewType);
        if (selectedYears.size > 0) {
            selectedYears.forEach(y => params.append('years', y));
        }
        if (selectedMonths.size > 0) {
            selectedMonths.forEach(m => params.append('months', m));
        }
        params.append('size', 1000); // Fetch a reasonable limit for client-side display

        axios.get(`/finance/transactions/v1?${params.toString()}`)
             .then(res => {
                 // Spring Data Page object returns data in 'content' array
                 setAllData(res.data.content || []);
             })
             .catch(err => console.error(err));
    }, [viewType, selectedYears, selectedMonths]);

    // Extract unique available years from data (this might be limited by current fetch, but we can hardcode or rely on what's fetched)
    const availableYears = useMemo(() => {
        // Ideally this should come from a separate API, but for now we extract from current data or we can just provide a static list or keep it simple.
        // If we are filtering on backend, the available years might disappear when filtering.
        // Let's use a static list for the last 5 years to ensure filters are always available.
        const currentYear = new Date().getFullYear();
        return [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];
    }, []);

    const availableMonths = [
        { num: 1, name: 'Jan' }, { num: 2, name: 'Feb' }, { num: 3, name: 'Mar' },
        { num: 4, name: 'Apr' }, { num: 5, name: 'May' }, { num: 6, name: 'Jun' },
        { num: 7, name: 'Jul' }, { num: 8, name: 'Aug' }, { num: 9, name: 'Sep' },
        { num: 10, name: 'Oct' }, { num: 11, name: 'Nov' }, { num: 12, name: 'Dec' }
    ];

    const toggleYear = (year) => {
        const next = new Set(selectedYears);
        if (next.has(year)) next.delete(year);
        else next.add(year);
        setSelectedYears(next);
    };

    const toggleMonth = (month) => {
        const next = new Set(selectedMonths);
        if (next.has(month)) next.delete(month);
        else next.add(month);
        setSelectedMonths(next);
    };

    const rowData = useMemo(() => {
        // Backend has already filtered the data
        return allData;
    }, [allData]);

    const colDefs = useMemo(() => {
        if (viewType === 'income') {
            return [
                { field: "txnYear", headerName: "Year", filter: 'agNumberColumnFilter', width: 100 },
                { field: "txnMonthNum", headerName: "Month", filter: 'agNumberColumnFilter', width: 100 },
                { field: "amount", headerName: "Amount", valueFormatter: p => p.value ? `₪${p.value}` : '' },
                { field: "sourceName", headerName: "Source", filter: true },
                { field: "sheetName", headerName: "Sheet", filter: true }
            ];
        } else {
            return [
                { field: "txnYear", headerName: "Year", filter: 'agNumberColumnFilter', width: 100 },
                { field: "txnMonthNum", headerName: "Month", filter: 'agNumberColumnFilter', width: 100 },
                { field: "amount", headerName: "Amount", valueFormatter: p => p.value ? `₪${p.value}` : '' },
                { field: "category", headerName: "Source", filter: true },
                { field: "topic", headerName: "Category (Topic)", filter: true },
                { field: "actor", headerName: "Actor", filter: true },
                { field: "paymentMethod", headerName: "Payment Method", filter: true },
                { field: "installments", headerName: "Total Inst.", filter: 'agNumberColumnFilter', width: 120 },
                { field: "installmentNo", headerName: "Inst. No", filter: 'agNumberColumnFilter', width: 110 },
                { field: "remainingAmount", headerName: "Remaining", valueFormatter: p => p.value ? `₪${p.value}` : '', width: 140 },
                { field: "sheetName", headerName: "Sheet", filter: true }
            ];
        }
    }, [viewType]);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150
    }), []);

    // Reusable styles for our filter pills
    const getPillStyle = (isSelected, activeColor) => ({
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        border: `1px solid ${isSelected ? activeColor : '#cbd5e1'}`,
        backgroundColor: isSelected ? activeColor : 'white',
        color: isSelected ? 'white' : '#475569',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none'
    });

    return (
        <div style={{ height: '75vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ color: '#1e293b', margin: 0 }}>
                        {viewType === 'income' ? 'Income' : 'Expense'} Transactions
                    </h2>
                    
                    {/* Filters Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* Year Filter */}
                        {availableYears.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginRight: '0.5rem' }}>Years:</span>
                                {availableYears.map(year => (
                                    <div 
                                        key={year} 
                                        onClick={() => toggleYear(year)}
                                        style={getPillStyle(selectedYears.size === 0 || selectedYears.has(year), '#3b82f6')}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Month Filter */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            flexWrap: 'nowrap', 
                            overflowX: 'auto',
                            paddingBottom: '4px',
                            msOverflowStyle: 'none',  /* IE and Edge */
                            scrollbarWidth: 'none'  /* Firefox */
                        }}>
                            <style>{`
                                .month-scroll-container::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>Months:</span>
                            <div className="month-scroll-container" style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                {availableMonths.map(month => (
                                    <div 
                                        key={month.num} 
                                        onClick={() => toggleMonth(month.num)}
                                        style={{
                                            ...getPillStyle(selectedMonths.size === 0 || selectedMonths.has(month.num), '#8b5cf6'),
                                            padding: '0.3rem 0.7rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {month.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button 
                        onClick={() => setViewType('expense')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: '1px solid #ef4444',
                            backgroundColor: viewType === 'expense' ? '#ef4444' : 'transparent',
                            color: viewType === 'expense' ? 'white' : '#ef4444',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}>
                        Expenses
                    </button>
                    <button 
                        onClick={() => setViewType('income')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: '1px solid #10b981',
                            backgroundColor: viewType === 'income' ? '#10b981' : 'transparent',
                            color: viewType === 'income' ? 'white' : '#10b981',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}>
                        Income
                    </button>
                </div>
            </div>
            
            <div style={{ flex: 1, width: '100%' }}>
                <AgGridReact
                    theme={themeQuartz}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={20}
                    paginationPageSizeSelector={[20, 50, 100]}
                />
            </div>
        </div>
    );
}

export const GRAPH_PRESETS = [
    {
        id: 'monthly-trend',
        name: 'Monthly Expenses Trend',
        config: {
            graphType: 'LINE',
            xAxisField: 'txnMonth',
            yAxisField: 'amount',
            multiCheckSelection: []
        }
    },
    {
        id: 'income-vs-expenses',
        name: 'Income vs Expenses',
        config: {
            graphType: 'BAR',
            xAxisField: 'txnType',
            yAxisField: 'amount',
            multiCheckSelection: []
        }
    },
    {
        id: 'daily-spending',
        name: 'Daily Spending this Month',
        config: {
            graphType: 'LINE',
            xAxisField: 'txnDate',
            yAxisField: 'amount',
            multiCheckSelection: [],
            currentMonthOnly: true
        }
    }
];

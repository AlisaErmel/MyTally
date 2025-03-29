import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch('https://sqliteapi-hn28.onrender.com/api/expenses');
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses data');
                }
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!expenses || expenses.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: '20px' }}>No expenses data available</div>;
    }

    const categoryData = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categoryColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0',
        '#FF9800', '#2196F3', '#00BCD4', '#FF5722', '#8BC34A',
        '#FFC107', '#673AB7', '#E91E63', '#3F51B5', '#607D8B'
    ];

    const data = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: categoryColors.slice(0, Object.keys(categoryData).length),
            hoverOffset: 4
        }]
    };

    const totalAmount = Object.values(categoryData).reduce((sum, value) => sum + value, 0).toFixed(2);

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to scale dynamically
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: '"DynaPuff", sans-serif', // Set legend font to DynaPuff
                        size: 14
                    },
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: €${tooltipItem.raw.toFixed(2)}`,
                },
                titleFont: {
                    family: '"DynaPuff", sans-serif',
                    size: 14
                },
                bodyFont: {
                    family: '"DynaPuff", sans-serif',
                    size: 12
                }
            },
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh', // Full height of the screen
            width: '100vw', // Full width of the screen
            padding: '20px',
            boxSizing: 'border-box',
            overflow: 'hidden', // Prevent overflow of content
        }}>
            <h2 style={{
                fontFamily: '"Fascinate", sans-serif',
                textAlign: 'center',
                marginBottom: '20px',
                color: "#213547"
            }}>
                Pie Chart - Expenses
            </h2>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '700px', // Prevent the chart from becoming too large
                height: '50vh', // Adjust height dynamically to keep it responsive
                marginBottom: '20px', // Space between chart and total amount
            }}>
                <Pie data={data} options={options} />
            </div>

            {/* Display the Total Amount below the Pie Chart */}
            <div style={{
                fontFamily: '"DynaPuff", sans-serif', // Same font as chart
                fontSize: '1.5em', // Use relative font size
                fontWeight: 'bold',
                textAlign: 'center',
                color: "#213547",
                marginTop: '20px', // Ensure space between chart and total amount
            }}>
                <span>Total Amount: €{totalAmount}</span>
            </div>
        </div>
    );

};

export default PieChart;

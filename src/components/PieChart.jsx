import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ expenses }) => {
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
            height: '100vh', // Full height of the screen
            width: '100vw', // Full width of the screen
            flexDirection: 'column',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <h2 style={{ fontFamily: '"Fascinate", sans-serif', textAlign: 'center', marginBottom: '20px' }}>Pie Chart - Expenses</h2>
            <div style={{
                width: '90vw', // Take up 90% of the viewport width
                maxWidth: '700px', // Prevent it from getting too large
                height: '70vh', // Ensure it takes a significant portion of the screen height
                maxHeight: '500px' // Prevents it from becoming too tall
            }}>
                <Pie data={data} options={options} />
            </div>
            {/* Display the Total Amount at the Bottom */}
            <div style={{
                marginTop: '20px',
                fontFamily: '"DynaPuff", sans-serif', // Use the same font as the chart
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                <span>Total Amount: €{totalAmount}</span>
            </div>
        </div>
    );
};

export default PieChart;

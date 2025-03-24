import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

const PieChart = ({ expenses }) => {
    // Check if expenses is undefined or empty
    if (!expenses || expenses.length === 0) {
        return <div>No expenses data available</div>;
    }

    // Calculate the sum of all expenses
    const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    // Group expenses by category and calculate totals
    const categoryData = expenses.reduce((acc, expense) => {
        if (acc[expense.category]) {
            acc[expense.category] += expense.amount;
        } else {
            acc[expense.category] = expense.amount;
        }
        return acc;
    }, {});

    // Color palette for the categories
    const categoryColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0',
        '#FF9800', '#2196F3', '#00BCD4', '#FF5722', '#8BC34A',
        '#FFC107', '#673AB7', '#E91E63', '#3F51B5', '#607D8B'
    ];

    // Prepare data for the pie chart
    const data = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: categoryColors, // Use the colors here
                hoverOffset: 4
            }
        ]
    };

    // Chart.js plugin to add total amount text in the center
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: €${tooltipItem.raw}`,
                },
            },
            // Adding custom plugin for center text (total amount)
            beforeDraw: (chart) => {
                const { ctx, chartArea: { top, left, width, height } } = chart;
                const total = totalAmount;
                const fontSize = (height / 100).toFixed(2); // Adjust font size relative to chart height

                // Check if the beforeDraw function is triggered
                console.log('Drawing before chart render');

                ctx.save();
                ctx.font = `${fontSize * 2}px Arial`; // Customize font size
                ctx.fillStyle = '#000'; // Text color
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Adjust text position and draw the total amount in the center
                ctx.fillText(`€${total.toFixed(2)}`, (width / 2) + left, (height / 2) + top);
                ctx.restore();
            }
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: 'auto',
                maxWidth: '200px', // This will control the size of the chart
                margin: '0 auto',
                paddingTop: '20px', // Add padding for spacing if necessary
            }}
        >
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;

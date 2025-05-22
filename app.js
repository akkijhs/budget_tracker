document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let myChart;

    // Function to render or update the chart
    function renderChart() {
        const monthlyData = {};

        // Aggregate expenses by month
        expenses.forEach(expense => {
            const monthYear = expense.month; // Format: "YYYY-MM"
            if (monthlyData[monthYear]) {
                monthlyData[monthYear] += parseFloat(expense.amount);
            } else {
                monthlyData[monthYear] = parseFloat(expense.amount);
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const chartLabels = sortedMonths;
        const chartData = sortedMonths.map(month => monthlyData[month]);

        if (myChart) {
            myChart.destroy(); // Destroy existing chart instance before creating a new one
        }

        myChart = new Chart(expenseChartCanvas, {
            type: 'bar', // or 'line'
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Monthly Expenditure',
                    data: chartData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value; // Assuming currency is INR
                            }
                        }
                    }
                }
            }
        });
    }

    // Handle form submission
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const month = document.getElementById('month').value;
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;

        if (month && amount) {
            expenses.push({ month, amount, description });
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderChart();
            expenseForm.reset();
        } else {
            alert('Please fill in both month and amount.');
        }
    });

    // Initial chart render on page load
    renderChart();
});
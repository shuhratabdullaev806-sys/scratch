// ===================================
// FAXR MADAD KONSALT - Material Accounting Simulator
// Main Application Logic
// ===================================

// Global state
let calculator = new InventoryCalculator();
let currentMethod = 'fifo';
let comparisonChart = null;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    attachEventListeners();
    setTodayDate();
});

function initializeApp() {
    updateMethodDescription();
    updateVisualization();
    updateBalance();
    updateTransactionTable();
    initializeComparisonChart();
}

function setTodayDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// ===================================
// EVENT LISTENERS
// ===================================

function attachEventListeners() {
    // Method selector buttons
    document.getElementById('fifoBtn').addEventListener('click', () => switchMethod('fifo'));
    document.getElementById('avecoBtn').addEventListener('click', () => switchMethod('aveco'));

    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', handleFormSubmit);

    // Transaction type radio buttons
    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', handleTypeChange);
    });

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', handleClear);
}

// ===================================
// METHOD SWITCHING
// ===================================

function switchMethod(method) {
    if (currentMethod === method) return;

    currentMethod = method;

    // Update button states
    document.getElementById('fifoBtn').classList.toggle('active', method === 'fifo');
    document.getElementById('avecoBtn').classList.toggle('active', method === 'aveco');

    // Update description
    updateMethodDescription();

    // Update visualization
    updateVisualization();

    // Update balance
    updateBalance();
}

function updateMethodDescription() {
    const descriptions = {
        fifo: 'FIFO usulida birinchi kelgan materiallar birinchi ishlatiladi. Har bir partiya alohida saqlanadi.',
        aveco: 'AVECO usulida barcha materiallar aralashtiriladi va o\'rtacha narx hisoblanadi.'
    };

    document.getElementById('methodDescription').textContent = descriptions[currentMethod];
}

// ===================================
// FORM HANDLING
// ===================================

function handleTypeChange(e) {
    const priceGroup = document.getElementById('priceGroup');
    const priceInput = document.getElementById('price');

    if (e.target.value === 'chiqim') {
        priceGroup.style.display = 'none';
        priceInput.removeAttribute('required');
    } else {
        priceGroup.style.display = 'block';
        priceInput.setAttribute('required', 'required');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        type: document.querySelector('input[name="type"]:checked').value,
        date: document.getElementById('date').value,
        quantity: parseFloat(document.getElementById('quantity').value),
        price: document.getElementById('price').value ? parseFloat(document.getElementById('price').value) : null
    };

    // Validate
    if (formData.quantity <= 0) {
        showNotification('Miqdor 0 dan katta bo\'lishi kerak!', 'error');
        return;
    }

    if (formData.type === 'kirim' && (!formData.price || formData.price <= 0)) {
        showNotification('Narx 0 dan katta bo\'lishi kerak!', 'error');
        return;
    }

    // Process transaction
    const result = calculator.addTransaction(
        formData.type,
        formData.date,
        formData.quantity,
        formData.price,
        currentMethod
    );

    if (result.success) {
        showNotification(
            formData.type === 'kirim'
                ? 'Kirim operatsiyasi muvaffaqiyatli qo\'shildi!'
                : 'Chiqim operatsiyasi muvaffaqiyatli qo\'shildi!',
            'success'
        );

        // Reset form
        document.getElementById('transactionForm').reset();
        setTodayDate();
        document.querySelector('input[name="type"][value="kirim"]').checked = true;
        handleTypeChange({ target: { value: 'kirim' } });

        // Update UI
        updateVisualization();
        updateBalance();
        updateTransactionTable();
        updateComparisonChart();
        updateStats();
    } else {
        showNotification(result.error, 'error');
    }
}

function handleClear() {
    if (confirm('Barcha ma\'lumotlarni o\'chirmoqchimisiz?')) {
        calculator.reset();
        updateVisualization();
        updateBalance();
        updateTransactionTable();
        updateComparisonChart();
        updateStats();
        showNotification('Barcha ma\'lumotlar o\'chirildi', 'info');
    }
}

// ===================================
// VISUALIZATION UPDATES
// ===================================

function updateVisualization() {
    // Toggle visibility
    document.getElementById('fifoVisualization').classList.toggle('active', currentMethod === 'fifo');
    document.getElementById('avecoVisualization').classList.toggle('active', currentMethod === 'aveco');

    if (currentMethod === 'fifo') {
        updateFIFOVisualization();
    } else {
        updateAVECOVisualization();
    }
}

function updateFIFOVisualization() {
    const container = document.getElementById('fifoLayers');
    const layers = calculator.fifoLayers;

    if (layers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📦</span>
                <p>Hozircha ombor bo'sh</p>
                <small>Kirim operatsiyasini qo'shing</small>
            </div>
        `;
        return;
    }

    container.innerHTML = layers.map((layer, index) => {
        const hue = (index * 40) % 360;
        return `
            <div class="fifo-layer" style="background: linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${hue}, 70%, 45%));">
                <div class="layer-info">
                    <div class="layer-date">📅 ${formatDate(layer.date)}</div>
                    <div class="layer-details">
                        ${formatNumber(layer.quantity)} dona × ${formatCurrency(layer.price)}
                    </div>
                </div>
                <div class="layer-badge">
                    ${formatCurrency(layer.totalValue)}
                </div>
            </div>
        `;
    }).join('');
}

function updateAVECOVisualization() {
    const container = document.getElementById('avecoPool');
    const pool = calculator.avecoPool;

    if (pool.quantity === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔄</span>
                <p>Hozircha ombor bo'sh</p>
                <small>Kirim operatsiyasini qo'shing</small>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="pool-content">
            <div class="pool-quantity">${formatNumber(pool.quantity)}</div>
            <div class="pool-label-text">dona material</div>
            <div class="pool-avg-price">
                O'rtacha: ${formatCurrency(pool.avgPrice)}
            </div>
        </div>
    `;
}

// ===================================
// BALANCE UPDATE
// ===================================

function updateBalance() {
    const balance = calculator.getCurrentBalance(currentMethod);

    document.getElementById('currentQuantity').textContent = formatNumber(balance.quantity);
    document.getElementById('currentValue').textContent = formatNumber(balance.value);
    document.getElementById('avgPrice').textContent = formatNumber(balance.avgPrice);
}

// ===================================
// TRANSACTION TABLE
// ===================================

function updateTransactionTable() {
    const tbody = document.getElementById('tableBody');
    const transactions = calculator.getTransactions();

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">
                    <div class="empty-state">
                        <span class="empty-icon">📋</span>
                        <p>Hozircha operatsiyalar yo'q</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = transactions.map((txn, index) => {
        const detailText = txn.type === 'chiqim' && txn.usedLayers
            ? txn.usedLayers.map(layer =>
                `${formatDate(layer.date)}: ${formatNumber(layer.quantity)} × ${formatCurrency(layer.price)}`
            ).join('<br>')
            : '-';

        return `
            <tr class="row-${txn.type}">
                <td>${index + 1}</td>
                <td>${formatDate(txn.date)}</td>
                <td><span class="badge badge-${txn.type}">${txn.type}</span></td>
                <td>${formatNumber(txn.quantity)}</td>
                <td>${formatCurrency(txn.price)}</td>
                <td>${formatCurrency(txn.totalValue)}</td>
                <td>${formatNumber(txn.balanceQuantity)}</td>
                <td>${formatCurrency(txn.balanceValue)}</td>
                <td class="detail-text">${detailText}</td>
            </tr>
        `;
    }).join('');
}

// ===================================
// COMPARISON CHART
// ===================================

function initializeComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    comparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'FIFO - Jami Tannarx',
                    data: [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'AVECO - Jami Tannarx',
                    data: [],
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '600'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: '700'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return formatNumber(value);
                        },
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateComparisonChart() {
    const transactions = calculator.getTransactions();

    if (transactions.length === 0) {
        comparisonChart.data.labels = [];
        comparisonChart.data.datasets[0].data = [];
        comparisonChart.data.datasets[1].data = [];
        comparisonChart.update();
        return;
    }

    // Calculate cumulative costs for both methods
    const fifoCalc = new InventoryCalculator();
    const avecoCalc = new InventoryCalculator();

    const labels = [];
    const fifoData = [];
    const avecoData = [];

    let fifoCumulativeCost = 0;
    let avecoCumulativeCost = 0;

    transactions.forEach((txn, index) => {
        // Process FIFO
        const fifoResult = fifoCalc.addTransaction(
            txn.type,
            txn.date,
            txn.quantity,
            txn.price,
            'fifo'
        );

        if (fifoResult.success && txn.type === 'chiqim') {
            fifoCumulativeCost += fifoResult.totalCost;
        }

        // Process AVECO
        const avecoResult = avecoCalc.addTransaction(
            txn.type,
            txn.date,
            txn.quantity,
            txn.price,
            'aveco'
        );

        if (avecoResult.success && txn.type === 'chiqim') {
            avecoCumulativeCost += avecoResult.totalCost;
        }

        labels.push(`Op ${index + 1}`);
        fifoData.push(fifoCumulativeCost);
        avecoData.push(avecoCumulativeCost);
    });

    comparisonChart.data.labels = labels;
    comparisonChart.data.datasets[0].data = fifoData;
    comparisonChart.data.datasets[1].data = avecoData;
    comparisonChart.update();
}

// ===================================
// STATS UPDATE
// ===================================

function updateStats() {
    const transactions = calculator.getTransactions();
    document.getElementById('totalTransactions').textContent = transactions.length;
}

// ===================================
// NOTIFICATIONS
// ===================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-success)' : type === 'error' ? 'var(--gradient-danger)' : 'var(--gradient-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 600;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

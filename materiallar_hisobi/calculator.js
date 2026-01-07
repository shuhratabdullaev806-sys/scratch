// ===================================
// FAXR MADAD KONSALT - Material Accounting Simulator
// Calculation Engine: FIFO & AVECO
// ===================================

class InventoryCalculator {
    constructor() {
        this.reset();
    }

    reset() {
        this.fifoLayers = [];
        this.avecoPool = {
            quantity: 0,
            totalValue: 0,
            avgPrice: 0
        };
        this.transactions = [];
    }

    // ===================================
    // FIFO CALCULATIONS
    // ===================================

    addFIFOInflow(date, quantity, price) {
        const layer = {
            date: date,
            quantity: quantity,
            price: price,
            totalValue: quantity * price
        };

        this.fifoLayers.push(layer);

        return {
            success: true,
            layers: [...this.fifoLayers],
            totalQuantity: this.getFIFOTotalQuantity(),
            totalValue: this.getFIFOTotalValue()
        };
    }

    processFIFOOutflow(date, quantity) {
        let remainingQuantity = quantity;
        let totalCost = 0;
        const usedLayers = [];

        // Check if we have enough inventory
        const availableQuantity = this.getFIFOTotalQuantity();
        if (availableQuantity < quantity) {
            return {
                success: false,
                error: `Omborda yetarli material yo'q! Mavjud: ${availableQuantity}, Kerak: ${quantity}`
            };
        }

        // Process outflow from oldest layers first
        let layerIndex = 0;
        while (remainingQuantity > 0 && layerIndex < this.fifoLayers.length) {
            const layer = this.fifoLayers[layerIndex];

            if (layer.quantity <= remainingQuantity) {
                // Use entire layer
                totalCost += layer.quantity * layer.price;
                usedLayers.push({
                    date: layer.date,
                    quantity: layer.quantity,
                    price: layer.price,
                    totalValue: layer.quantity * layer.price
                });
                remainingQuantity -= layer.quantity;
                this.fifoLayers.splice(layerIndex, 1);
            } else {
                // Use partial layer
                const usedQuantity = remainingQuantity;
                totalCost += usedQuantity * layer.price;
                usedLayers.push({
                    date: layer.date,
                    quantity: usedQuantity,
                    price: layer.price,
                    totalValue: usedQuantity * layer.price
                });
                layer.quantity -= usedQuantity;
                layer.totalValue = layer.quantity * layer.price;
                remainingQuantity = 0;
                layerIndex++;
            }
        }

        return {
            success: true,
            totalCost: totalCost,
            avgPrice: totalCost / quantity,
            usedLayers: usedLayers,
            layers: [...this.fifoLayers],
            totalQuantity: this.getFIFOTotalQuantity(),
            totalValue: this.getFIFOTotalValue()
        };
    }

    getFIFOTotalQuantity() {
        return this.fifoLayers.reduce((sum, layer) => sum + layer.quantity, 0);
    }

    getFIFOTotalValue() {
        return this.fifoLayers.reduce((sum, layer) => sum + layer.totalValue, 0);
    }

    // ===================================
    // AVECO CALCULATIONS
    // ===================================

    addAVECOInflow(date, quantity, price) {
        const inflowValue = quantity * price;

        this.avecoPool.quantity += quantity;
        this.avecoPool.totalValue += inflowValue;

        // Recalculate average price
        if (this.avecoPool.quantity > 0) {
            this.avecoPool.avgPrice = this.avecoPool.totalValue / this.avecoPool.quantity;
        }

        return {
            success: true,
            quantity: this.avecoPool.quantity,
            totalValue: this.avecoPool.totalValue,
            avgPrice: this.avecoPool.avgPrice
        };
    }

    processAVECOOutflow(date, quantity) {
        // Check if we have enough inventory
        if (this.avecoPool.quantity < quantity) {
            return {
                success: false,
                error: `Omborda yetarli material yo'q! Mavjud: ${this.avecoPool.quantity}, Kerak: ${quantity}`
            };
        }

        const totalCost = quantity * this.avecoPool.avgPrice;

        this.avecoPool.quantity -= quantity;
        this.avecoPool.totalValue -= totalCost;

        // Recalculate average price (should remain the same)
        if (this.avecoPool.quantity > 0) {
            this.avecoPool.avgPrice = this.avecoPool.totalValue / this.avecoPool.quantity;
        } else {
            this.avecoPool.avgPrice = 0;
        }

        return {
            success: true,
            totalCost: totalCost,
            avgPrice: this.avecoPool.avgPrice,
            quantity: this.avecoPool.quantity,
            totalValue: this.avecoPool.totalValue
        };
    }

    // ===================================
    // TRANSACTION MANAGEMENT
    // ===================================

    addTransaction(type, date, quantity, price = null, method = 'fifo') {
        let result;

        if (type === 'kirim') {
            if (method === 'fifo') {
                result = this.addFIFOInflow(date, quantity, price);
            } else {
                result = this.addAVECOInflow(date, quantity, price);
            }

            if (result.success) {
                this.transactions.push({
                    id: Date.now(),
                    type: 'kirim',
                    date: date,
                    quantity: quantity,
                    price: price,
                    totalValue: quantity * price,
                    method: method,
                    balanceQuantity: method === 'fifo' ? result.totalQuantity : result.quantity,
                    balanceValue: method === 'fifo' ? result.totalValue : result.totalValue
                });
            }
        } else {
            if (method === 'fifo') {
                result = this.processFIFOOutflow(date, quantity);
            } else {
                result = this.processAVECOOutflow(date, quantity);
            }

            if (result.success) {
                this.transactions.push({
                    id: Date.now(),
                    type: 'chiqim',
                    date: date,
                    quantity: quantity,
                    price: result.avgPrice,
                    totalValue: result.totalCost,
                    method: method,
                    balanceQuantity: method === 'fifo' ? result.totalQuantity : result.quantity,
                    balanceValue: method === 'fifo' ? result.totalValue : result.totalValue,
                    usedLayers: result.usedLayers || null
                });
            }
        }

        return result;
    }

    getTransactions() {
        return [...this.transactions];
    }

    getCurrentBalance(method = 'fifo') {
        if (method === 'fifo') {
            const quantity = this.getFIFOTotalQuantity();
            const value = this.getFIFOTotalValue();
            return {
                quantity: quantity,
                value: value,
                avgPrice: quantity > 0 ? value / quantity : 0
            };
        } else {
            return {
                quantity: this.avecoPool.quantity,
                value: this.avecoPool.totalValue,
                avgPrice: this.avecoPool.avgPrice
            };
        }
    }

    // ===================================
    // COMPARISON UTILITIES
    // ===================================

    compareMethodsForTransaction(transactions) {
        // Create two separate calculators for comparison
        const fifoCalc = new InventoryCalculator();
        const avecoCalc = new InventoryCalculator();

        const comparison = {
            fifo: { totalCost: 0, transactions: [] },
            aveco: { totalCost: 0, transactions: [] }
        };

        transactions.forEach(txn => {
            // Process FIFO
            const fifoResult = fifoCalc.addTransaction(
                txn.type,
                txn.date,
                txn.quantity,
                txn.price,
                'fifo'
            );

            if (fifoResult.success && txn.type === 'chiqim') {
                comparison.fifo.totalCost += fifoResult.totalCost;
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
                comparison.aveco.totalCost += avecoResult.totalCost;
            }
        });

        comparison.fifo.balance = fifoCalc.getCurrentBalance('fifo');
        comparison.aveco.balance = avecoCalc.getCurrentBalance('aveco');

        return comparison;
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatNumber(num) {
    return new Intl.NumberFormat('uz-UZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatCurrency(num) {
    return formatNumber(num) + ' so\'m';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InventoryCalculator, formatNumber, formatCurrency, formatDate };
}

// Main application logic using localStorage
class ShopperApp {
    constructor() {
        this.currentUser = null;
        this.orders = [];
        this.settings = this.getDefaultSettings();
        this.filteredOrders = [];
        this.currentWeekStart = null;
        this.chart = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.checkAuthState();
        this.initializeEventListeners();
        this.initializeTabs();
        this.loadUserData();
        this.updateEarningsPreview();
    }

    getDefaultSettings() {
        return {
            tariff1Name: 'Supermercado Local',
            tariff1Value: 5000,
            tariff2Name: 'Supermercado Premium',
            tariff2Value: 7000,
            skuValue: 150,
            kmValue: 200
        };
    }

    checkAuthState() {
        const currentUser = localStorage.getItem('shopperApp_currentUser');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
            document.getElementById('userEmail').textContent = this.currentUser.email;
        } else {
            window.location.href = 'index.html';
        }
    }

    initializeEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Order form
        document.getElementById('orderForm').addEventListener('submit', (e) => this.saveOrder(e));
        
        // Real-time calculation
        ['tariffSelect', 'skuCount', 'kilometers'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.updateEarningsPreview());
        });
        
        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => this.saveSettings(e));
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterOrders(e.target.value));
        document.getElementById('clearSearch').addEventListener('click', () => this.clearSearch());
        
        // Summary filters
        document.getElementById('prevWeek').addEventListener('click', () => this.navigateWeek(-1));
        document.getElementById('nextWeek').addEventListener('click', () => this.navigateWeek(1));
        document.getElementById('weekPicker').addEventListener('change', (e) => this.selectWeek(e.target.value));
        
        // Modal events
        document.getElementById('modalCancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modalConfirm').addEventListener('click', () => this.confirmModalAction());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideModal();
        });
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });
        
        // Load specific tab data
        if (tabName === 'history') {
            this.displayOrders();
        } else if (tabName === 'summary') {
            this.initializeSummaryTab();
        }
    }

    // Order Management
    async saveOrder(e) {
        e.preventDefault();
        
        const orderData = {
            id: this.generateOrderId(),
            name: document.getElementById('orderName').value.trim(),
            tariffType: document.getElementById('tariffSelect').value,
            skuCount: parseInt(document.getElementById('skuCount').value) || 0,
            kilometers: parseFloat(document.getElementById('kilometers').value) || 0,
            createdAt: new Date(),
            userId: this.currentUser.id
        };
        
        // Validation
        if (!orderData.name || !orderData.tariffType) {
            this.showToast('Por favor completa todos los campos requeridos', 'error');
            return;
        }
        
        // Calculate earnings
        const earnings = this.calculateEarnings(orderData.tariffType, orderData.skuCount, orderData.kilometers);
        orderData.earnings = earnings.total;
        orderData.breakdown = earnings;
        
        this.setFormLoading('orderForm', true);
        
        try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Add to local array
            this.orders.unshift(orderData);
            
            // Save to localStorage
            this.saveOrdersToStorage();
            
            this.showToast('Pedido guardado exitosamente', 'success');
            this.resetOrderForm();
            this.updateEarningsPreview();
            
        } catch (error) {
            console.error('Error saving order:', error);
            this.showToast('Error al guardar el pedido', 'error');
        } finally {
            this.setFormLoading('orderForm', false);
        }
    }

    generateOrderId() {
        return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    calculateEarnings(tariffType, skuCount, kilometers) {
        const baseFee = tariffType === 'tariff1' ? this.settings.tariff1Value : this.settings.tariff2Value;
        const skuTotal = skuCount * this.settings.skuValue;
        const kmTotal = kilometers * this.settings.kmValue;
        const total = baseFee + skuTotal + kmTotal;
        
        return {
            baseFee,
            skuTotal,
            kmTotal,
            total
        };
    }

    updateEarningsPreview() {
        const tariffType = document.getElementById('tariffSelect').value;
        const skuCount = parseInt(document.getElementById('skuCount').value) || 0;
        const kilometers = parseFloat(document.getElementById('kilometers').value) || 0;
        
        if (tariffType) {
            const earnings = this.calculateEarnings(tariffType, skuCount, kilometers);
            
            document.getElementById('baseFeeDisplay').textContent = this.formatCurrency(earnings.baseFee);
            document.getElementById('skuCountDisplay').textContent = skuCount;
            document.getElementById('skuValueDisplay').textContent = this.formatCurrency(this.settings.skuValue);
            document.getElementById('skuTotalDisplay').textContent = this.formatCurrency(earnings.skuTotal);
            document.getElementById('kmCountDisplay').textContent = kilometers;
            document.getElementById('kmValueDisplay').textContent = this.formatCurrency(this.settings.kmValue);
            document.getElementById('kmTotalDisplay').textContent = this.formatCurrency(earnings.kmTotal);
            document.getElementById('totalEarningsDisplay').textContent = this.formatCurrency(earnings.total);
        } else {
            // Reset display
            ['baseFeeDisplay', 'skuTotalDisplay', 'kmTotalDisplay', 'totalEarningsDisplay'].forEach(id => {
                document.getElementById(id).textContent = '$0';
            });
            document.getElementById('skuCountDisplay').textContent = skuCount;
            document.getElementById('kmCountDisplay').textContent = kilometers;
            document.getElementById('skuValueDisplay').textContent = this.formatCurrency(this.settings.skuValue);
            document.getElementById('kmValueDisplay').textContent = this.formatCurrency(this.settings.kmValue);
        }
    }

    resetOrderForm() {
        document.getElementById('orderForm').reset();
        document.getElementById('skuCount').value = 0;
        document.getElementById('kilometers').value = 0;
    }

    // Data Management
    loadUserData() {
        try {
            // Load orders
            const ordersData = localStorage.getItem(`shopperApp_orders_${this.currentUser.id}`);
            if (ordersData) {
                this.orders = JSON.parse(ordersData).map(order => ({
                    ...order,
                    createdAt: new Date(order.createdAt)
                }));
            }
            
            // Load settings
            const settingsData = localStorage.getItem(`shopperApp_settings_${this.currentUser.id}`);
            if (settingsData) {
                this.settings = { ...this.settings, ...JSON.parse(settingsData) };
            }
            
            this.updateSettingsForm();
            this.updateTariffOptions();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showToast('Error al cargar los datos', 'error');
        }
    }

    saveOrdersToStorage() {
        try {
            const ordersToSave = this.orders.map(order => ({
                ...order,
                createdAt: order.createdAt.toISOString()
            }));
            localStorage.setItem(`shopperApp_orders_${this.currentUser.id}`, JSON.stringify(ordersToSave));
        } catch (error) {
            console.error('Error saving orders:', error);
            this.showToast('Error al guardar los pedidos', 'error');
        }
    }

    saveSettingsToStorage() {
        try {
            localStorage.setItem(`shopperApp_settings_${this.currentUser.id}`, JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast('Error al guardar la configuración', 'error');
        }
    }

    displayOrders(ordersToShow = null) {
        const ordersList = document.getElementById('ordersList');
        const orders = ordersToShow || this.orders;
        
        if (orders.length === 0) {
            ordersList.innerHTML = '<div class="no-orders"><p>No hay pedidos para mostrar</p></div>';
            return;
        }
        
        ordersList.innerHTML = orders.map(order => this.createOrderHTML(order)).join('');
        
        // Add delete event listeners
        ordersList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-item').dataset.orderId;
                this.showDeleteConfirmation(orderId);
            });
        });
    }

    createOrderHTML(order) {
        const tariffName = order.tariffType === 'tariff1' ? this.settings.tariff1Name : this.settings.tariff2Name;
        
        return `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-name">${order.name}</div>
                    <div class="order-date">${this.formatDate(order.createdAt)}</div>
                </div>
                <div class="order-details">
                    <div class="detail-item">
                        <span class="detail-label">Tarifa</span>
                        <span class="detail-value">${tariffName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">SKUs</span>
                        <span class="detail-value">${order.skuCount}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Kilómetros</span>
                        <span class="detail-value">${order.kilometers}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Hora</span>
                        <span class="detail-value">${this.formatTime(order.createdAt)}</span>
                    </div>
                </div>
                <div class="order-earnings">
                    Ganancia: ${this.formatCurrency(order.earnings)}
                </div>
                <div class="order-actions">
                    <button class="btn-delete">Eliminar</button>
                </div>
            </div>
        `;
    }

    filterOrders(searchTerm) {
        if (!searchTerm.trim()) {
            this.filteredOrders = [];
            this.displayOrders();
            return;
        }
        
        const term = searchTerm.toLowerCase();
        this.filteredOrders = this.orders.filter(order => {
            return order.name.toLowerCase().includes(term) ||
                   this.formatDate(order.createdAt).toLowerCase().includes(term);
        });
        
        this.displayOrders(this.filteredOrders);
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        this.filteredOrders = [];
        this.displayOrders();
    }

    async deleteOrder(orderId) {
        try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Remove from local array
            this.orders = this.orders.filter(order => order.id !== orderId);
            this.filteredOrders = this.filteredOrders.filter(order => order.id !== orderId);
            
            // Save to localStorage
            this.saveOrdersToStorage();
            
            // Update displays
            this.displayOrders(this.filteredOrders.length > 0 ? this.filteredOrders : null);
            
            this.showToast('Pedido eliminado exitosamente', 'success');
            
        } catch (error) {
            console.error('Error deleting order:', error);
            this.showToast('Error al eliminar el pedido', 'error');
        }
    }

    // Settings Management
    async saveSettings(e) {
        e.preventDefault();
        
        const newSettings = {
            tariff1Name: document.getElementById('tariff1Name').value.trim(),
            tariff1Value: parseInt(document.getElementById('tariff1Value').value) || 0,
            tariff2Name: document.getElementById('tariff2Name').value.trim(),
            tariff2Value: parseInt(document.getElementById('tariff2Value').value) || 0,
            skuValue: parseInt(document.getElementById('skuValue').value) || 0,
            kmValue: parseInt(document.getElementById('kmValue').value) || 0
        };
        
        // Validation
        if (!newSettings.tariff1Name || !newSettings.tariff2Name) {
            this.showToast('Por favor completa todos los nombres de tarifas', 'error');
            return;
        }
        
        if (newSettings.tariff1Value <= 0 || newSettings.tariff2Value <= 0 || 
            newSettings.skuValue <= 0 || newSettings.kmValue <= 0) {
            this.showToast('Todos los valores deben ser mayores a 0', 'error');
            return;
        }
        
        this.setFormLoading('settingsForm', true);
        
        try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.settings = newSettings;
            this.saveSettingsToStorage();
            this.updateTariffOptions();
            this.updateEarningsPreview();
            
            this.showToast('Configuración guardada exitosamente', 'success');
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast('Error al guardar la configuración', 'error');
        } finally {
            this.setFormLoading('settingsForm', false);
        }
    }

    updateSettingsForm() {
        document.getElementById('tariff1Name').value = this.settings.tariff1Name;
        document.getElementById('tariff1Value').value = this.settings.tariff1Value;
        document.getElementById('tariff2Name').value = this.settings.tariff2Name;
        document.getElementById('tariff2Value').value = this.settings.tariff2Value;
        document.getElementById('skuValue').value = this.settings.skuValue;
        document.getElementById('kmValue').value = this.settings.kmValue;
    }

    updateTariffOptions() {
        const tariffSelect = document.getElementById('tariffSelect');
        const options = tariffSelect.querySelectorAll('option');
        
        if (options.length >= 2) {
            options[1].textContent = this.settings.tariff1Name;
            options[2].textContent = this.settings.tariff2Name;
        }
    }

    // Summary Management
    initializeSummaryTab() {
        // Initialize with current week if not set
        if (!this.currentWeekStart) {
            this.currentWeekStart = this.getWeekStart(new Date());
        }
        this.updateWeekDisplay();
        this.updateDailySummary();
    }

    navigateWeek(direction) {
        const newWeekStart = new Date(this.currentWeekStart);
        newWeekStart.setDate(newWeekStart.getDate() + (direction * 7));
        this.currentWeekStart = newWeekStart;
        this.updateWeekDisplay();
        this.updateDailySummary();
    }

    selectWeek(dateString) {
        if (dateString) {
            const selectedDate = new Date(dateString);
            this.currentWeekStart = this.getWeekStart(selectedDate);
            this.updateWeekDisplay();
            this.updateDailySummary();
        }
    }

    updateWeekDisplay() {
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const displayText = `Semana del ${this.formatDate(this.currentWeekStart)} al ${this.formatDate(weekEnd)}`;
        document.getElementById('weekDisplay').textContent = displayText;
        
        // Update week picker value
        const weekPicker = document.getElementById('weekPicker');
        weekPicker.value = this.currentWeekStart.toISOString().split('T')[0];
        
        // Update navigation buttons
        const today = new Date();
        const nextWeekStart = new Date(this.currentWeekStart);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        
        document.getElementById('nextWeek').disabled = nextWeekStart > today;
    }

    updateDailySummary() {
        const weekOrders = this.getWeekOrders();
        const dailyData = this.calculateDailyData(weekOrders);
        
        this.updateWeeklySummaryCards(dailyData, weekOrders);
        this.updateDailyChart(dailyData);
        this.updateDailyTable(dailyData);
        this.updateMonthlyOverview();
    }

    getWeekOrders() {
        const weekEnd = new Date(this.currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        return this.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= this.currentWeekStart && orderDate <= weekEnd;
        });
    }

    calculateDailyData(weekOrders) {
        const dailyData = [];
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(this.currentWeekStart);
            currentDay.setDate(currentDay.getDate() + i);
            
            const dayOrders = weekOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.toDateString() === currentDay.toDateString();
            });
            
            const totalEarnings = dayOrders.reduce((sum, order) => sum + order.earnings, 0);
            const averagePerOrder = dayOrders.length > 0 ? totalEarnings / dayOrders.length : 0;
            
            dailyData.push({
                date: new Date(currentDay),
                dayName: dayNames[currentDay.getDay()],
                orders: dayOrders,
                orderCount: dayOrders.length,
                totalEarnings,
                averagePerOrder
            });
        }
        
        return dailyData;
    }

    updateWeeklySummaryCards(dailyData, weekOrders) {
        const totalWeekly = dailyData.reduce((sum, day) => sum + day.totalEarnings, 0);
        const workingDays = dailyData.filter(day => day.orderCount > 0).length;
        const dailyAverage = workingDays > 0 ? totalWeekly / workingDays : 0;
        const bestDay = dailyData.reduce((best, day) => 
            day.totalEarnings > best.totalEarnings ? day : best, 
            { totalEarnings: 0, dayName: '-' }
        );
        
        document.getElementById('weeklyTotal').textContent = this.formatCurrency(totalWeekly);
        document.getElementById('dailyAverage').textContent = this.formatCurrency(dailyAverage);
        document.getElementById('weeklyOrders').textContent = weekOrders.length;
        document.getElementById('bestDay').textContent = bestDay.totalEarnings > 0 ? bestDay.dayName : '-';
    }

    updateDailyChart(dailyData) {
        const canvas = document.getElementById('dailyChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 60;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const barWidth = chartWidth / 7;
        
        // Find max value for scaling
        const maxEarnings = Math.max(...dailyData.map(day => day.totalEarnings), 1);
        
        // Draw bars
        dailyData.forEach((day, index) => {
            const barHeight = (day.totalEarnings / maxEarnings) * chartHeight;
            const x = padding + (index * barWidth) + (barWidth * 0.1);
            const y = padding + chartHeight - barHeight;
            const width = barWidth * 0.8;
            
            // Bar color based on earnings
            const intensity = day.totalEarnings / maxEarnings;
            ctx.fillStyle = `rgba(37, 99, 235, ${0.3 + (intensity * 0.7)})`;
            ctx.fillRect(x, y, width, barHeight);
            
            // Bar border
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, barHeight);
            
            // Day labels
            ctx.fillStyle = '#374151';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(day.dayName.substring(0, 3), x + width/2, canvas.height - 20);
            
            // Value labels
            if (day.totalEarnings > 0) {
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
                const valueText = this.formatCurrency(day.totalEarnings).replace('$', '');
                ctx.fillText(valueText, x + width/2, y - 5);
            }
        });
        
        // Draw axes
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
    }

    updateDailyTable(dailyData) {
        const tbody = document.getElementById('dailyTableBody');
        
        if (dailyData.every(day => day.orderCount === 0)) {
            tbody.innerHTML = '<tr class="no-data-row"><td colspan="5">No hay pedidos en esta semana</td></tr>';
            return;
        }
        
        tbody.innerHTML = dailyData.map(day => `
            <tr>
                <td class="day-name">${day.dayName}</td>
                <td>${this.formatDate(day.date)}</td>
                <td>${day.orderCount > 0 ? day.orderCount : '<span class="no-orders">Sin pedidos</span>'}</td>
                <td class="earnings-cell">${day.orderCount > 0 ? this.formatCurrency(day.totalEarnings) : '-'}</td>
                <td>${day.orderCount > 0 ? this.formatCurrency(day.averagePerOrder) : '-'}</td>
            </tr>
        `).join('');
    }

    updateMonthlyOverview() {
        const currentMonth = new Date(this.currentWeekStart.getFullYear(), this.currentWeekStart.getMonth(), 1);
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        
        const monthOrders = this.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= currentMonth && orderDate < nextMonth;
        });
        
        const monthlyTotal = monthOrders.reduce((sum, order) => sum + order.earnings, 0);
        
        // Calculate working days in month
        const workingDays = new Set();
        monthOrders.forEach(order => {
            const dateKey = new Date(order.createdAt).toDateString();
            workingDays.add(dateKey);
        });
        
        // Calculate weeks in month
        const weeksInMonth = Math.ceil((nextMonth - currentMonth) / (7 * 24 * 60 * 60 * 1000));
        const monthlyWeeklyAvg = weeksInMonth > 0 ? monthlyTotal / weeksInMonth : 0;
        
        document.getElementById('monthlyTotal').textContent = this.formatCurrency(monthlyTotal);
        document.getElementById('monthlyWeeklyAvg').textContent = this.formatCurrency(monthlyWeeklyAvg);
        document.getElementById('workingDays').textContent = workingDays.size;
    }

    // Utility Functions
    getWeekKey(date) {
        const weekStart = this.getWeekStart(date);
        return `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
        return new Date(d.setDate(diff));
    }

    getWeekEnd(date) {
        const weekStart = this.getWeekStart(date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return weekEnd;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // UI Helper Functions
    setFormLoading(formId, loading) {
        const form = document.getElementById(formId);
        const button = form.querySelector('button[type="submit"]');
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.btn-text');
        
        if (loading) {
            button.disabled = true;
            spinner.style.display = 'block';
            text.style.opacity = '0.7';
        } else {
            button.disabled = false;
            spinner.style.display = 'none';
            text.style.opacity = '1';
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<div class="toast-message">${message}</div>`;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    // Modal Functions
    showDeleteConfirmation(orderId) {
        this.pendingAction = () => this.deleteOrder(orderId);
        document.getElementById('modalTitle').textContent = 'Eliminar Pedido';
        document.getElementById('modalMessage').textContent = '¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.';
        this.showModal();
    }

    showModal() {
        document.getElementById('modalOverlay').classList.add('show');
    }

    hideModal() {
        document.getElementById('modalOverlay').classList.remove('show');
        this.pendingAction = null;
    }

    confirmModalAction() {
        if (this.pendingAction) {
            this.pendingAction();
            this.hideModal();
        }
    }

    logout() {
        try {
            localStorage.removeItem('shopperApp_currentUser');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
            this.showToast('Error al cerrar sesión', 'error');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShopperApp();
});
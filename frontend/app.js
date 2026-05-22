// Poultry Management System - Frontend Application
const API_URL = 'http://localhost:3000/api';

// Global state
let appData = {
    batches: [],
    incubators: [],
    batteries: [],
    expenses: [],
    poultryTypes: [],
    settings: { darkMode: false }
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadData();
    setupDateInputs();
});

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('poultrySettings');
    if (savedSettings) {
        appData.settings = JSON.parse(savedSettings);
        if (appData.settings.darkMode) {
            document.documentElement.classList.add('dark');
        }
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('poultrySettings', JSON.stringify(appData.settings));
}

// Toggle dark mode
function toggleDarkMode() {
    appData.settings.darkMode = !appData.settings.darkMode;
    if (appData.settings.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    saveSettings();
}

// Setup date inputs with today's date
function setupDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = ['batch-start-date', 'expense-date'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = today;
    });
}

// Load all data from backend
async function loadData() {
    try {
        const [batchesRes, incubatorsRes, expensesRes, typesRes] = await Promise.all([
            fetch(`${API_URL}/batches`),
            fetch(`${API_URL}/incubators`),
            fetch(`${API_URL}/expenses`),
            fetch(`${API_URL}/poultry-types`)
        ]);

        appData.batches = await batchesRes.json();
        appData.incubators = await incubatorsRes.json();
        appData.expenses = await expensesRes.json();
        appData.poultryTypes = await typesRes.json();

        renderAll();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to demo data if backend is not available
        loadDemoData();
    }
}

// Load demo data for testing
function loadDemoData() {
    console.log('Using demo data mode');
    appData.poultryTypes = [
        {
            id: 'quail-texas',
            name: 'سمان تكساس',
            lifespan: 45,
            incubationDays: 17,
            prices: { egg: 0.5, chick: 3, adult: 15 }
        },
        {
            id: 'chicken-broiler',
            name: 'دجاج لحم',
            lifespan: 42,
            incubationDays: 21,
            prices: { egg: 1, chick: 5, adult: 25 }
        }
    ];
    renderAll();
}

// Render all components
function renderAll() {
    renderDashboard();
    renderBatches();
    renderIncubators();
    renderExpenses();
    renderStatistics();
    renderTypes();
    populateTypeSelects();
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(sectionId).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('hover:bg-gray-200', 'dark:hover:bg-gray-700');
    });
    event.target.closest('.nav-btn').classList.add('bg-primary', 'text-white');
    event.target.closest('.nav-btn').classList.remove('hover:bg-gray-200', 'dark:hover:bg-gray-700');
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Calculate age in days
function calculateAge(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get stage based on age and type
function getStage(age, typeId) {
    const type = appData.poultryTypes.find(t => t.id === typeId);
    if (!type) return 'unknown';

    if (age < type.incubationDays) return 'egg';
    if (age < type.chickStage?.[1] || (type.chickStage && age <= type.chickStage[1])) return 'chick';
    if (age < type.growerStage?.[1] || (type.growerStage && age <= type.growerStage[1])) return 'grower';
    return 'adult';
}

// Get stage name in Arabic
function getStageName(stage) {
    const stages = {
        'egg': 'بيض',
        'chick': 'كتكوت',
        'grower': 'نامي',
        'adult': 'بالغ',
        'unknown': 'غير معروف'
    };
    return stages[stage] || stage;
}

// Render Dashboard
function renderDashboard() {
    // Statistics
    const stats = calculateStatistics();
    document.getElementById('dash-total-batches').textContent = stats.totalBatches;
    document.getElementById('dash-active-batches').textContent = stats.activeBatches;
    document.getElementById('dash-net-profit').textContent = `${stats.netProfit.toFixed(2)} ر.س`;
    document.getElementById('dash-profit-margin').textContent = `${stats.profitMargin.toFixed(1)}%`;

    // Alerts
    renderAlerts();

    // Recent batches
    const recentTable = document.getElementById('recent-batches-table');
    recentTable.innerHTML = '';
    appData.batches.slice(-5).reverse().forEach(batch => {
        const age = calculateAge(batch.startDate);
        const stage = getStage(age, batch.type);
        const type = appData.poultryTypes.find(t => t.id === batch.type);
        
        const row = `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="py-3 px-4">${type?.name || batch.type}</td>
                <td class="py-3 px-4">${batch.initialCount}</td>
                <td class="py-3 px-4">${age}</td>
                <td class="py-3 px-4"><span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">${getStageName(stage)}</span></td>
                <td class="py-3 px-4"><span class="px-2 py-1 ${batch.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} rounded text-sm">${batch.status === 'active' ? 'نشط' : 'مكتمل'}</span></td>
            </tr>
        `;
        recentTable.innerHTML += row;
    });
}

// Render alerts
function renderAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';
    
    const alerts = [];
    
    // Check for batches needing attention
    appData.batches.forEach(batch => {
        if (batch.status !== 'active') return;
        
        const age = calculateAge(batch.startDate);
        const type = appData.poultryTypes.find(t => t.id === batch.type);
        
        if (!type) return;
        
        // Quail day 7 check
        if (type.category === 'quail' && age === 7) {
            alerts.push({
                type: 'warning',
                message: `دفعة ${type.name}: اليوم السابع - يجب فحص البيض وإزالة غير المخصب`,
                batch: batch
            });
        }
        
        // Last 3 days of incubation - don't open incubator
        if (age >= type.incubationDays - 3 && age < type.incubationDays) {
            alerts.push({
                type: 'danger',
                message: `دفعة ${type.name}: آخر 3 أيام من التفقيس - لا تفتح الفقاصة للحفاظ على الرطوبة`,
                batch: batch
            });
        }
        
        // End of cycle approaching
        if (age >= type.lifespan - 5 && age < type.lifespan) {
            alerts.push({
                type: 'info',
                message: `دفعة ${type.name}: اقتربت من نهاية الدورة (${type.lifespan - age} أيام متبقية)`,
                batch: batch
            });
        }
    });
    
    if (alerts.length === 0) {
        alertsContainer.innerHTML = `
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200">
                <i class="fas fa-check-circle ml-2"></i>
                لا توجد تنبيهات هامة حالياً
            </div>
        `;
        return;
    }
    
    alerts.forEach(alert => {
        const colors = {
            'warning': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
            'danger': 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
            'info': 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
        };
        const icons = {
            'warning': 'fa-exclamation-triangle',
            'danger': 'fa-times-circle',
            'info': 'fa-info-circle'
        };
        
        alertsContainer.innerHTML += `
            <div class="p-4 ${colors[alert.type]} rounded-lg flex items-center gap-3">
                <i class="fas ${icons[alert.type]} text-xl"></i>
                <span>${alert.message}</span>
            </div>
        `;
    });
}

// Render Batches
function renderBatches() {
    const table = document.getElementById('batches-table');
    table.innerHTML = '';
    
    appData.batches.forEach(batch => {
        const age = calculateAge(batch.startDate);
        const stage = getStage(age, batch.type);
        const type = appData.poultryTypes.find(t => t.id === batch.type);
        
        const row = `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="py-3 px-4">${type?.name || batch.type}</td>
                <td class="py-3 px-4">${batch.startDate}</td>
                <td class="py-3 px-4">${batch.initialCount}</td>
                <td class="py-3 px-4">${batch.currentCount || batch.initialCount}</td>
                <td class="py-3 px-4">${age}</td>
                <td class="py-3 px-4"><span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">${getStageName(stage)}</span></td>
                <td class="py-3 px-4"><span class="px-2 py-1 ${batch.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} rounded text-sm">${batch.status === 'active' ? 'نشط' : 'مكتمل'}</span></td>
                <td class="py-3 px-4">
                    <button onclick="editBatch('${batch.id}')" class="text-blue-500 hover:text-blue-700 ml-2"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteBatch('${batch.id}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// Render Incubators
function renderIncubators() {
    const grid = document.getElementById('incubators-grid');
    grid.innerHTML = '';
    
    appData.incubators.forEach(incubator => {
        const card = `
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-bold text-lg">${incubator.name}</h3>
                    <span class="px-3 py-1 ${incubator.status === 'running' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'} rounded-full text-sm">
                        ${incubator.status === 'running' ? 'يعمل' : 'متاح'}
                    </span>
                </div>
                <div class="space-y-2 text-sm">
                    <p><i class="fas fa-expand ml-2"></i>السعة: ${incubator.capacity} بيضة</p>
                    <p><i class="fas fa-cog ml-2"></i>النوع: ${incubator.type === 'automatic' ? 'أوتوماتيك' : 'يدوي'}</p>
                    ${incubator.notes ? `<p><i class="fas fa-sticky-note ml-2"></i>${incubator.notes}</p>` : ''}
                </div>
                <div class="mt-4 flex gap-2">
                    <button onclick="toggleIncubator('${incubator.id}')" class="flex-1 bg-primary hover:bg-secondary text-white py-2 rounded transition-all">
                        ${incubator.status === 'running' ? 'إيقاف' : 'تشغيل'}
                    </button>
                    <button onclick="deleteIncubator('${incubator.id}')" class="px-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-all">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Render Expenses
function renderExpenses() {
    const table = document.getElementById('expenses-table');
    table.innerHTML = '';
    
    const stats = calculateStatistics();
    document.getElementById('total-expenses').textContent = `${stats.totalExpenses.toFixed(2)} ر.س`;
    document.getElementById('total-income').textContent = `${stats.totalIncome.toFixed(2)} ر.س`;
    document.getElementById('net-profit-detail').textContent = `${stats.netProfit.toFixed(2)} ر.س`;
    
    appData.expenses.forEach(expense => {
        const typeNames = {
            'feed': 'علف',
            'water': 'ماء',
            'electricity': 'كهرباء',
            'medicine': 'أدوية',
            'equipment': 'معدات',
            'maintenance': 'صيانة',
            'other': 'أخرى'
        };
        
        const row = `
            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="py-3 px-4">${typeNames[expense.type] || expense.type}</td>
                <td class="py-3 px-4">${expense.description}</td>
                <td class="py-3 px-4 text-red-500 font-bold">${parseFloat(expense.amount).toFixed(2)} ر.س</td>
                <td class="py-3 px-4">${expense.date}</td>
                <td class="py-3 px-4">
                    <button onclick="deleteExpense('${expense.id}')" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// Render Statistics
function renderStatistics() {
    const stats = calculateStatistics();
    
    // Birds by type
    const birdsChart = document.getElementById('birds-by-type-chart');
    birdsChart.innerHTML = '';
    
    Object.entries(stats.birdsByType).forEach(([typeId, count]) => {
        const type = appData.poultryTypes.find(t => t.id === typeId);
        const percentage = stats.totalBirds > 0 ? (count / stats.totalBirds * 100) : 0;
        
        birdsChart.innerHTML += `
            <div>
                <div class="flex justify-between mb-1">
                    <span>${type?.name || typeId}</span>
                    <span>${count} طائر (${percentage.toFixed(1)}%)</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });
    
    // Financial summary
    const financialSummary = document.getElementById('financial-summary');
    financialSummary.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <span>إجمالي الدخل:</span>
                <span class="font-bold text-green-500">${stats.totalIncome.toFixed(2)} ر.س</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
                <span>إجمالي المصاريف:</span>
                <span class="font-bold text-red-500">${stats.totalExpenses.toFixed(2)} ر.س</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <span>صافي الربح:</span>
                <span class="font-bold text-blue-500">${stats.netProfit.toFixed(2)} ر.س</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-accent/10 rounded">
                <span>نسبة الربح:</span>
                <span class="font-bold text-accent">${stats.profitMargin.toFixed(1)}%</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                <span>رأس المال:</span>
                <span class="font-bold text-purple-500">${stats.capital.toFixed(2)} ر.س</span>
            </div>
        </div>
    `;
}

// Render Types
function renderTypes() {
    const grid = document.getElementById('types-grid');
    grid.innerHTML = '';
    
    appData.poultryTypes.forEach(type => {
        const card = `
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 class="font-bold text-xl mb-2">${type.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${type.nameEn || ''}</p>
                <div class="space-y-2 text-sm">
                    <p><i class="fas fa-clock ml-2"></i>فترة التربية: ${type.lifespan} يوم</p>
                    <p><i class="fas fa-egg ml-2"></i>فترة التفقيس: ${type.incubationDays} يوم</p>
                    <p><i class="fas fa-weight-hanging ml-2"></i>الوزن البالغ: ${type.adultWeight} جرام</p>
                </div>
                <div class="mt-4 pt-4 border-t dark:border-gray-600">
                    <h4 class="font-bold mb-2">أسعار مقترحة:</h4>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        ${type.prices.egg ? `<div>بيضة: ${type.prices.egg} ر.س</div>` : ''}
                        ${type.prices.chick ? `<div>كتكوت: ${type.prices.chick} ر.س</div>` : ''}
                        ${type.prices.adult ? `<div>بالغ: ${type.prices.adult} ر.س</div>` : ''}
                        ${type.prices.pair ? `<div>زوج: ${type.prices.pair} ر.س</div>` : ''}
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Populate type selects
function populateTypeSelects() {
    const select = document.getElementById('batch-type');
    if (select) {
        select.innerHTML = '';
        appData.poultryTypes.forEach(type => {
            select.innerHTML += `<option value="${type.id}">${type.name}</option>`;
        });
    }
}

// Calculate statistics
function calculateStatistics() {
    const totalBatches = appData.batches.length;
    const activeBatches = appData.batches.filter(b => b.status === 'active').length;
    
    const totalExpenses = appData.expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalIncome = appData.batches.reduce((sum, b) => sum + parseFloat(b.totalSales || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
    
    const birdsByType = appData.batches.reduce((acc, batch) => {
        acc[batch.type] = (acc[batch.type] || 0) + (batch.currentCount || batch.initialCount || 0);
        return acc;
    }, {});
    
    const totalBirds = Object.values(birdsByType).reduce((sum, count) => sum + count, 0);
    
    return {
        totalBatches,
        activeBatches,
        totalExpenses,
        totalIncome,
        netProfit,
        profitMargin,
        birdsByType,
        totalBirds,
        capital: totalExpenses
    };
}

// Save batch
async function saveBatch(event) {
    event.preventDefault();
    
    const batchData = {
        type: document.getElementById('batch-type').value,
        startDate: document.getElementById('batch-start-date').value,
        startStage: document.getElementById('batch-start-stage').value,
        initialCount: parseInt(document.getElementById('batch-initial-count').value),
        purchasePrice: parseFloat(document.getElementById('batch-purchase-price').value),
        notes: document.getElementById('batch-notes').value,
        currentCount: parseInt(document.getElementById('batch-initial-count').value)
    };
    
    try {
        const response = await fetch(`${API_URL}/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batchData)
        });
        
        if (response.ok) {
            const newBatch = await response.json();
            appData.batches.push(newBatch);
            closeModal('batch-modal');
            renderAll();
            alert('تم إضافة الدفعة بنجاح!');
        } else {
            throw new Error('Failed to save batch');
        }
    } catch (error) {
        console.error('Error saving batch:', error);
        // Fallback: add to local array
        batchData.id = 'local-' + Date.now();
        batchData.status = 'active';
        batchData.createdAt = new Date().toISOString();
        appData.batches.push(batchData);
        closeModal('batch-modal');
        renderAll();
        alert('تم إضافة الدفعة بنجاح! (وضع محلي)');
    }
}

// Save incubator
async function saveIncubator(event) {
    event.preventDefault();
    
    const incubatorData = {
        name: document.getElementById('incubator-name').value,
        capacity: parseInt(document.getElementById('incubator-capacity').value),
        type: document.getElementById('incubator-type').value,
        notes: document.getElementById('incubator-notes').value
    };
    
    try {
        const response = await fetch(`${API_URL}/incubators`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(incubatorData)
        });
        
        if (response.ok) {
            const newIncubator = await response.json();
            appData.incubators.push(newIncubator);
            closeModal('incubator-modal');
            renderAll();
            alert('تم إضافة الحاضنة بنجاح!');
        } else {
            throw new Error('Failed to save incubator');
        }
    } catch (error) {
        console.error('Error saving incubator:', error);
        // Fallback: add to local array
        incubatorData.id = 'local-' + Date.now();
        incubatorData.status = 'available';
        incubatorData.createdAt = new Date().toISOString();
        appData.incubators.push(incubatorData);
        closeModal('incubator-modal');
        renderAll();
        alert('تم إضافة الحاضنة بنجاح! (وضع محلي)');
    }
}

// Save expense
async function saveExpense(event) {
    event.preventDefault();
    
    const expenseData = {
        type: document.getElementById('expense-type').value,
        description: document.getElementById('expense-description').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        date: document.getElementById('expense-date').value
    };
    
    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });
        
        if (response.ok) {
            const newExpense = await response.json();
            appData.expenses.push(newExpense);
            closeModal('expense-modal');
            renderAll();
            alert('تم إضافة المصروف بنجاح!');
        } else {
            throw new Error('Failed to save expense');
        }
    } catch (error) {
        console.error('Error saving expense:', error);
        // Fallback: add to local array
        expenseData.id = 'local-' + Date.now();
        expenseData.createdAt = new Date().toISOString();
        appData.expenses.push(expenseData);
        closeModal('expense-modal');
        renderAll();
        alert('تم إضافة المصروف بنجاح! (وضع محلي)');
    }
}

// Delete functions
async function deleteBatch(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الدفعة؟')) return;
    
    try {
        await fetch(`${API_URL}/batches/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting batch:', error);
    }
    
    appData.batches = appData.batches.filter(b => b.id !== id);
    renderAll();
}

async function deleteIncubator(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الحاضنة؟')) return;
    
    try {
        await fetch(`${API_URL}/incubators/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting incubator:', error);
    }
    
    appData.incubators = appData.incubators.filter(i => i.id !== id);
    renderAll();
}

async function deleteExpense(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;
    
    try {
        await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
    
    appData.expenses = appData.expenses.filter(e => e.id !== id);
    renderAll();
}

// Toggle incubator status
function toggleIncubator(id) {
    const incubator = appData.incubators.find(i => i.id === id);
    if (incubator) {
        incubator.status = incubator.status === 'running' ? 'available' : 'running';
        renderAll();
    }
}

// Edit batch (placeholder)
function editBatch(id) {
    alert('ميزة التعديل قيد التطوير');
}

// Auto-refresh every minute
setInterval(() => {
    loadData();
}, 60000);

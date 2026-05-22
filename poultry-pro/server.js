const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'poultry-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        batches: [],
        incubators: [],
        batteries: [],
        expenses: [],
        poultryTypes: [
            {
                id: 1,
                name: 'سمان تكساس',
                category: 'quail',
                lifespan: 45,
                eggPeriod: 17,
                chickPeriod: 20,
                growerPeriod: 35,
                matureWeight: 250,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 60,
                maxHumidity: 70,
                feedType: 'بادئة سمان',
                feedPerDay: 20,
                eggPrice: 0.5,
                chickPrice: 3,
                growerPrice: 8,
                adultPrice: 15,
                pairPrice: 25,
                groupPrice: 40,
                notes: 'سمان سريع النمو، يصل لوزن الذبح خلال 35-40 يوم'
            },
            {
                id: 2,
                name: 'سمان بلدي',
                category: 'quail',
                lifespan: 60,
                eggPeriod: 17,
                chickPeriod: 20,
                growerPeriod: 40,
                matureWeight: 180,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 60,
                maxHumidity: 70,
                feedType: 'بادئة سمان',
                feedPerDay: 18,
                eggPrice: 0.4,
                chickPrice: 2.5,
                growerPrice: 6,
                adultPrice: 12,
                pairPrice: 20,
                groupPrice: 35,
                notes: 'سمان مقاوم للأمراض، مناسب للتربية التقليدية'
            },
            {
                id: 3,
                name: 'دجاج لحم (فروج)',
                category: 'chicken',
                lifespan: 45,
                eggPeriod: 21,
                chickPeriod: 10,
                growerPeriod: 35,
                matureWeight: 2500,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 60,
                maxHumidity: 70,
                feedType: 'تسمين دواجن',
                feedPerDay: 120,
                eggPrice: 1,
                chickPrice: 5,
                growerPrice: 15,
                adultPrice: 25,
                pairPrice: 45,
                groupPrice: 80,
                notes: 'دجاج سريع النمو للحم، يصل لوزن الذبح خلال 35-40 يوم'
            },
            {
                id: 4,
                name: 'دجاج بياض',
                category: 'chicken',
                lifespan: 500,
                eggPeriod: 21,
                chickPeriod: 10,
                growerPeriod: 120,
                matureWeight: 1800,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 60,
                maxHumidity: 70,
                feedType: 'نامي دواجن',
                feedPerDay: 110,
                eggPrice: 1,
                chickPrice: 6,
                growerPrice: 20,
                adultPrice: 35,
                pairPrice: 65,
                groupPrice: 100,
                notes: 'دجاج متخصص لإنتاج البيض، يبدأ الإنتاج من عمر 5 أشهر'
            },
            {
                id: 5,
                name: 'دجاج بلدي',
                category: 'chicken',
                lifespan: 400,
                eggPeriod: 21,
                chickPeriod: 10,
                growerPeriod: 150,
                matureWeight: 1500,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 60,
                maxHumidity: 70,
                feedType: 'مختلط',
                feedPerDay: 90,
                eggPrice: 0.8,
                chickPrice: 4,
                growerPrice: 12,
                adultPrice: 30,
                pairPrice: 55,
                groupPrice: 90,
                notes: 'دجاج مقاوم للأمراض، مناسب للتربية الحرة'
            },
            {
                id: 6,
                name: 'بط',
                category: 'duck',
                lifespan: 300,
                eggPeriod: 28,
                chickPeriod: 15,
                growerPeriod: 60,
                matureWeight: 3000,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 65,
                maxHumidity: 75,
                feedType: 'بط نامي',
                feedPerDay: 150,
                eggPrice: 1.5,
                chickPrice: 8,
                growerPrice: 25,
                adultPrice: 45,
                pairPrice: 80,
                groupPrice: 120,
                notes: 'البط يحتاج مساحات مائية للنمو الأمثل'
            },
            {
                id: 7,
                name: 'وز',
                category: 'goose',
                lifespan: 400,
                eggPeriod: 30,
                chickPeriod: 20,
                growerPeriod: 90,
                matureWeight: 5000,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 65,
                maxHumidity: 75,
                feedType: 'وز نامي',
                feedPerDay: 200,
                eggPrice: 2,
                chickPrice: 15,
                growerPrice: 40,
                adultPrice: 80,
                pairPrice: 150,
                groupPrice: 200,
                notes: 'الوز من الطيور الكبيرة، يحتاج مساحات واسعة'
            },
            {
                id: 8,
                name: 'رومي',
                category: 'turkey',
                lifespan: 200,
                eggPeriod: 28,
                chickPeriod: 20,
                growerPeriod: 120,
                matureWeight: 8000,
                minTemp: 37.5,
                maxTemp: 38,
                minHumidity: 60,
                maxHumidity: 70,
                feedType: 'رومي نامي',
                feedPerDay: 250,
                eggPrice: 2.5,
                chickPrice: 20,
                growerPrice: 60,
                adultPrice: 120,
                pairPrice: 220,
                groupPrice: 300,
                notes: 'الرومي من الطيور الكبيرة ذات القيمة الغذائية العالية'
            }
        ],
        settings: {
            currency: 'ريال',
            darkMode: false
        }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Helper functions
function loadData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// API Routes

// Get all data
app.get('/api/data', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Batches
app.get('/api/batches', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data: data.batches });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/batches', (req, res) => {
    try {
        const data = loadData();
        const newBatch = {
            id: generateId(),
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        data.batches.push(newBatch);
        saveData(data);
        res.json({ success: true, data: newBatch });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/batches/:id', (req, res) => {
    try {
        const data = loadData();
        const index = data.batches.findIndex(b => b.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Batch not found' });
        }
        data.batches[index] = { ...data.batches[index], ...req.body };
        saveData(data);
        res.json({ success: true, data: data.batches[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/batches/:id', (req, res) => {
    try {
        const data = loadData();
        data.batches = data.batches.filter(b => b.id !== req.params.id);
        saveData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Incubators
app.get('/api/incubators', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data: data.incubators });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/incubators', (req, res) => {
    try {
        const data = loadData();
        const newIncubator = {
            id: generateId(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.incubators.push(newIncubator);
        saveData(data);
        res.json({ success: true, data: newIncubator });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/incubators/:id', (req, res) => {
    try {
        const data = loadData();
        const index = data.incubators.findIndex(i => i.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Incubator not found' });
        }
        data.incubators[index] = { ...data.incubators[index], ...req.body };
        saveData(data);
        res.json({ success: true, data: data.incubators[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/incubators/:id', (req, res) => {
    try {
        const data = loadData();
        data.incubators = data.incubators.filter(i => i.id !== req.params.id);
        saveData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Batteries
app.get('/api/batteries', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data: data.batteries });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/batteries', (req, res) => {
    try {
        const data = loadData();
        const newBattery = {
            id: generateId(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.batteries.push(newBattery);
        saveData(data);
        res.json({ success: true, data: newBattery });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/batteries/:id', (req, res) => {
    try {
        const data = loadData();
        const index = data.batteries.findIndex(b => b.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Battery not found' });
        }
        data.batteries[index] = { ...data.batteries[index], ...req.body };
        saveData(data);
        res.json({ success: true, data: data.batteries[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/batteries/:id', (req, res) => {
    try {
        const data = loadData();
        data.batteries = data.batteries.filter(b => b.id !== req.params.id);
        saveData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Expenses
app.get('/api/expenses', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data: data.expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/expenses', (req, res) => {
    try {
        const data = loadData();
        const newExpense = {
            id: generateId(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.expenses.push(newExpense);
        saveData(data);
        res.json({ success: true, data: newExpense });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/expenses/:id', (req, res) => {
    try {
        const data = loadData();
        const index = data.expenses.findIndex(e => e.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Expense not found' });
        }
        data.expenses[index] = { ...data.expenses[index], ...req.body };
        saveData(data);
        res.json({ success: true, data: data.expenses[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/expenses/:id', (req, res) => {
    try {
        const data = loadData();
        data.expenses = data.expenses.filter(e => e.id !== req.params.id);
        saveData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Poultry Types
app.get('/api/poultry-types', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data: data.poultryTypes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/poultry-types', (req, res) => {
    try {
        const data = loadData();
        const newType = {
            id: generateId(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.poultryTypes.push(newType);
        saveData(data);
        res.json({ success: true, data: newType });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/poultry-types/:id', (req, res) => {
    try {
        const data = loadData();
        const index = data.poultryTypes.findIndex(t => t.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Poultry type not found' });
        }
        data.poultryTypes[index] = { ...data.poultryTypes[index], ...req.body };
        saveData(data);
        res.json({ success: true, data: data.poultryTypes[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Settings
app.get('/api/settings', (req, res) => {
    try {
        const data = loadData();
        res.json({ success: true, data: data.settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/settings', (req, res) => {
    try {
        const data = loadData();
        data.settings = { ...data.settings, ...req.body };
        saveData(data);
        res.json({ success: true, data: data.settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Statistics endpoint
app.get('/api/statistics', (req, res) => {
    try {
        const data = loadData();
        
        // Calculate statistics
        const totalBatches = data.batches.length;
        const activeBatches = data.batches.filter(b => b.status === 'active').length;
        const completedBatches = data.batches.filter(b => b.status === 'completed').length;
        
        const totalIncubators = data.incubators.length;
        const totalBatteries = data.batteries.length;
        
        const totalExpenses = data.expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
        const totalRevenue = data.batches.reduce((sum, b) => sum + (parseFloat(b.totalRevenue) || 0), 0);
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0;
        
        // Group by poultry type
        const batchesByType = {};
        data.batches.forEach(batch => {
            const typeName = batch.poultryTypeName || 'غير محدد';
            if (!batchesByType[typeName]) {
                batchesByType[typeName] = { count: 0, revenue: 0, expenses: 0 };
            }
            batchesByType[typeName].count++;
            batchesByType[typeName].revenue += parseFloat(batch.totalRevenue) || 0;
        });
        
        // Calculate expenses by category
        const expensesByCategory = {};
        data.expenses.forEach(expense => {
            const category = expense.category || 'أخرى';
            if (!expensesByCategory[category]) {
                expensesByCategory[category] = 0;
            }
            expensesByCategory[category] += parseFloat(expense.amount) || 0;
        });
        
        res.json({
            success: true,
            data: {
                totalBatches,
                activeBatches,
                completedBatches,
                totalIncubators,
                totalBatteries,
                totalExpenses,
                totalRevenue,
                netProfit,
                profitMargin,
                batchesByType,
                expensesByCategory
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🐔 خادم برنامج إدارة الدواجن يعمل على http://localhost:${PORT}`);
    console.log(`📊 البيانات محفوظة في: ${DATA_FILE}`);
});

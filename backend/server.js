const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, '../data/database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
function initializeDatabase() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            batches: [],
            incubators: [],
            batteries: [],
            expenses: [],
            poultryTypes: [
                {
                    id: 'quail-texas',
                    name: 'سمان تكساس',
                    nameEn: 'Texas Quail',
                    category: 'quail',
                    lifespan: 45,
                    incubationDays: 17,
                    chickStage: [0, 14],
                    growerStage: [15, 30],
                    finisherStage: [31, 45],
                    eggWeight: 10,
                    adultWeight: 250,
                    tempRequirements: {
                        '0-7': { temp: 37, humidity: 60 },
                        '8-14': { temp: 35, humidity: 55 },
                        '15-21': { temp: 32, humidity: 50 },
                        '22-30': { temp: 28, humidity: 50 },
                        '31-45': { temp: 24, humidity: 50 }
                    },
                    feedRequirements: {
                        '0-14': { type: 'بادئة', protein: 24, quantity: 15 },
                        '15-30': { type: 'نامية', protein: 20, quantity: 25 },
                        '31-45': { type: 'تسمين', protein: 18, quantity: 35 }
                    },
                    prices: {
                        egg: 0.5,
                        chick: 3,
                        grower: 8,
                        adult: 15,
                        pair: 25,
                        group: 40
                    }
                },
                {
                    id: 'quail-baladi',
                    name: 'سمان بلدي',
                    nameEn: 'Baladi Quail',
                    category: 'quail',
                    lifespan: 50,
                    incubationDays: 17,
                    chickStage: [0, 14],
                    growerStage: [15, 35],
                    finisherStage: [36, 50],
                    eggWeight: 9,
                    adultWeight: 180,
                    tempRequirements: {
                        '0-7': { temp: 37, humidity: 60 },
                        '8-14': { temp: 35, humidity: 55 },
                        '15-21': { temp: 32, humidity: 50 },
                        '22-35': { temp: 28, humidity: 50 },
                        '36-50': { temp: 24, humidity: 50 }
                    },
                    feedRequirements: {
                        '0-14': { type: 'بادئة', protein: 24, quantity: 12 },
                        '15-35': { type: 'نامية', protein: 20, quantity: 22 },
                        '36-50': { type: 'تسمين', protein: 18, quantity: 30 }
                    },
                    prices: {
                        egg: 0.4,
                        chick: 2.5,
                        grower: 7,
                        adult: 12,
                        pair: 20,
                        group: 35
                    }
                },
                {
                    id: 'chicken-broiler',
                    name: 'دجاج لحم (فروج)',
                    nameEn: 'Broiler Chicken',
                    category: 'chicken',
                    lifespan: 42,
                    incubationDays: 21,
                    chickStage: [0, 10],
                    growerStage: [11, 24],
                    finisherStage: [25, 42],
                    eggWeight: 55,
                    adultWeight: 2500,
                    tempRequirements: {
                        '0-7': { temp: 35, humidity: 65 },
                        '8-14': { temp: 32, humidity: 60 },
                        '15-21': { temp: 28, humidity: 55 },
                        '22-28': { temp: 24, humidity: 55 },
                        '29-42': { temp: 22, humidity: 50 }
                    },
                    feedRequirements: {
                        '0-10': { type: 'بادئة', protein: 23, quantity: 350 },
                        '11-24': { type: 'نامية', protein: 20, quantity: 1200 },
                        '25-42': { type: 'تسمين', protein: 18, quantity: 2000 }
                    },
                    prices: {
                        egg: 1,
                        chick: 5,
                        grower: 15,
                        adult: 25,
                        pair: 45,
                        group: 80,
                        slaughtered: 30
                    }
                },
                {
                    id: 'chicken-layer',
                    name: 'دجاج بياض',
                    nameEn: 'Layer Chicken',
                    category: 'chicken',
                    lifespan: 72,
                    incubationDays: 21,
                    chickStage: [0, 8],
                    growerStage: [9, 18],
                    finisherStage: [19, 72],
                    eggWeight: 55,
                    adultWeight: 1800,
                    tempRequirements: {
                        '0-7': { temp: 35, humidity: 65 },
                        '8-14': { temp: 32, humidity: 60 },
                        '15-21': { temp: 28, humidity: 55 },
                        '22-72': { temp: 24, humidity: 50 }
                    },
                    feedRequirements: {
                        '0-8': { type: 'بادئة', protein: 20, quantity: 300 },
                        '9-18': { type: 'نامية', protein: 17, quantity: 800 },
                        '19-72': { type: 'إنتاج', protein: 16, quantity: 120 }
                    },
                    prices: {
                        egg: 1,
                        chick: 6,
                        grower: 18,
                        adult: 30,
                        pair: 50,
                        group: 90
                    }
                },
                {
                    id: 'chicken-baladi',
                    name: 'دجاج بلدي',
                    nameEn: 'Baladi Chicken',
                    category: 'chicken',
                    lifespan: 90,
                    incubationDays: 21,
                    chickStage: [0, 10],
                    growerStage: [11, 30],
                    finisherStage: [31, 90],
                    eggWeight: 45,
                    adultWeight: 1500,
                    tempRequirements: {
                        '0-7': { temp: 35, humidity: 65 },
                        '8-14': { temp: 32, humidity: 60 },
                        '15-21': { temp: 28, humidity: 55 },
                        '22-30': { temp: 26, humidity: 55 },
                        '31-90': { temp: 24, humidity: 50 }
                    },
                    feedRequirements: {
                        '0-10': { type: 'بادئة', protein: 20, quantity: 250 },
                        '11-30': { type: 'نامية', protein: 17, quantity: 700 },
                        '31-90': { type: 'إنتاج', protein: 15, quantity: 100 }
                    },
                    prices: {
                        egg: 0.8,
                        chick: 4,
                        grower: 12,
                        adult: 25,
                        pair: 45,
                        group: 75,
                        slaughtered: 28
                    }
                },
                {
                    id: 'duck',
                    name: 'بط',
                    nameEn: 'Duck',
                    category: 'waterfowl',
                    lifespan: 60,
                    incubationDays: 28,
                    chickStage: [0, 14],
                    growerStage: [15, 35],
                    finisherStage: [36, 60],
                    eggWeight: 70,
                    adultWeight: 3000,
                    tempRequirements: {
                        '0-7': { temp: 35, humidity: 70 },
                        '8-14': { temp: 32, humidity: 65 },
                        '15-28': { temp: 28, humidity: 60 },
                        '29-60': { temp: 24, humidity: 55 }
                    },
                    feedRequirements: {
                        '0-14': { type: 'بادئة', protein: 20, quantity: 400 },
                        '15-35': { type: 'نامية', protein: 17, quantity: 900 },
                        '36-60': { type: 'تسمين', protein: 15, quantity: 1500 }
                    },
                    prices: {
                        egg: 1.5,
                        chick: 8,
                        grower: 20,
                        adult: 35,
                        pair: 60,
                        group: 100,
                        slaughtered: 40
                    }
                },
                {
                    id: 'goose',
                    name: 'وز',
                    nameEn: 'Goose',
                    category: 'waterfowl',
                    lifespan: 90,
                    incubationDays: 30,
                    chickStage: [0, 21],
                    growerStage: [22, 45],
                    finisherStage: [46, 90],
                    eggWeight: 150,
                    adultWeight: 5000,
                    tempRequirements: {
                        '0-7': { temp: 35, humidity: 70 },
                        '8-14': { temp: 32, humidity: 65 },
                        '15-21': { temp: 30, humidity: 60 },
                        '22-45': { temp: 26, humidity: 55 },
                        '46-90': { temp: 22, humidity: 50 }
                    },
                    feedRequirements: {
                        '0-21': { type: 'بادئة', protein: 18, quantity: 500 },
                        '22-45': { type: 'نامية', protein: 15, quantity: 1200 },
                        '46-90': { type: 'تسمين', protein: 13, quantity: 2000 }
                    },
                    prices: {
                        egg: 2,
                        chick: 15,
                        grower: 35,
                        adult: 60,
                        pair: 100,
                        group: 180,
                        slaughtered: 70
                    }
                },
                {
                    id: 'turkey',
                    name: 'رومي',
                    nameEn: 'Turkey',
                    category: 'poultry',
                    lifespan: 120,
                    incubationDays: 28,
                    chickStage: [0, 21],
                    growerStage: [22, 56],
                    finisherStage: [57, 120],
                    eggWeight: 80,
                    adultWeight: 8000,
                    tempRequirements: {
                        '0-7': { temp: 37, humidity: 65 },
                        '8-14': { temp: 35, humidity: 60 },
                        '15-21': { temp: 32, humidity: 55 },
                        '22-56': { temp: 28, humidity: 50 },
                        '57-120': { temp: 24, humidity: 45 }
                    },
                    feedRequirements: {
                        '0-21': { type: 'بادئة', protein: 28, quantity: 600 },
                        '22-56': { type: 'نامية', protein: 20, quantity: 1800 },
                        '57-120': { type: 'تسمين', protein: 16, quantity: 3000 }
                    },
                    prices: {
                        egg: 2.5,
                        chick: 20,
                        grower: 50,
                        adult: 100,
                        pair: 180,
                        group: 300,
                        slaughtered: 120
                    }
                }
            ],
            settings: {
                currency: 'SAR',
                darkMode: false
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    }
}

// Helper functions
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return null;
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// API Routes

// Get all data
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Batches
app.get('/api/batches', (req, res) => {
    const data = readData();
    res.json(data.batches);
});

app.post('/api/batches', (req, res) => {
    const data = readData();
    const newBatch = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    data.batches.push(newBatch);
    writeData(data);
    res.json(newBatch);
});

app.put('/api/batches/:id', (req, res) => {
    const data = readData();
    const index = data.batches.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
        data.batches[index] = { ...data.batches[index], ...req.body };
        writeData(data);
        res.json(data.batches[index]);
    } else {
        res.status(404).json({ error: 'Batch not found' });
    }
});

app.delete('/api/batches/:id', (req, res) => {
    const data = readData();
    data.batches = data.batches.filter(b => b.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
});

// Incubators
app.get('/api/incubators', (req, res) => {
    const data = readData();
    res.json(data.incubators);
});

app.post('/api/incubators', (req, res) => {
    const data = readData();
    const newIncubator = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString(),
        status: 'available'
    };
    data.incubators.push(newIncubator);
    writeData(data);
    res.json(newIncubator);
});

app.put('/api/incubators/:id', (req, res) => {
    const data = readData();
    const index = data.incubators.findIndex(i => i.id === req.params.id);
    if (index !== -1) {
        data.incubators[index] = { ...data.incubators[index], ...req.body };
        writeData(data);
        res.json(data.incubators[index]);
    } else {
        res.status(404).json({ error: 'Incubator not found' });
    }
});

app.delete('/api/incubators/:id', (req, res) => {
    const data = readData();
    data.incubators = data.incubators.filter(i => i.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
});

// Batteries
app.get('/api/batteries', (req, res) => {
    const data = readData();
    res.json(data.batteries);
});

app.post('/api/batteries', (req, res) => {
    const data = readData();
    const newBattery = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.batteries.push(newBattery);
    writeData(data);
    res.json(newBattery);
});

app.put('/api/batteries/:id', (req, res) => {
    const data = readData();
    const index = data.batteries.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
        data.batteries[index] = { ...data.batteries[index], ...req.body };
        writeData(data);
        res.json(data.batteries[index]);
    } else {
        res.status(404).json({ error: 'Battery not found' });
    }
});

app.delete('/api/batteries/:id', (req, res) => {
    const data = readData();
    data.batteries = data.batteries.filter(b => b.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
});

// Expenses
app.get('/api/expenses', (req, res) => {
    const data = readData();
    res.json(data.expenses);
});

app.post('/api/expenses', (req, res) => {
    const data = readData();
    const newExpense = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.expenses.push(newExpense);
    writeData(data);
    res.json(newExpense);
});

app.put('/api/expenses/:id', (req, res) => {
    const data = readData();
    const index = data.expenses.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
        data.expenses[index] = { ...data.expenses[index], ...req.body };
        writeData(data);
        res.json(data.expenses[index]);
    } else {
        res.status(404).json({ error: 'Expense not found' });
    }
});

app.delete('/api/expenses/:id', (req, res) => {
    const data = readData();
    data.expenses = data.expenses.filter(e => e.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
});

// Poultry Types
app.get('/api/poultry-types', (req, res) => {
    const data = readData();
    res.json(data.poultryTypes);
});

app.post('/api/poultry-types', (req, res) => {
    const data = readData();
    const newType = {
        id: uuidv4(),
        ...req.body
    };
    data.poultryTypes.push(newType);
    writeData(data);
    res.json(newType);
});

// Settings
app.get('/api/settings', (req, res) => {
    const data = readData();
    res.json(data.settings);
});

app.put('/api/settings', (req, res) => {
    const data = readData();
    data.settings = { ...data.settings, ...req.body };
    writeData(data);
    res.json(data.settings);
});

// Statistics endpoint
app.get('/api/statistics', (req, res) => {
    const data = readData();
    
    const totalBatches = data.batches.length;
    const activeBatches = data.batches.filter(b => b.status === 'active').length;
    const completedBatches = data.batches.filter(b => b.status === 'completed').length;
    
    const totalExpenses = data.expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalIncome = data.batches.reduce((sum, b) => sum + parseFloat(b.totalSales || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
    
    const totalIncubators = data.incubators.length;
    const activeIncubators = data.incubators.filter(i => i.status === 'running').length;
    
    const totalBatteries = data.batteries.length;
    
    const birdsByType = data.batches.reduce((acc, batch) => {
        acc[batch.type] = (acc[batch.type] || 0) + (batch.currentCount || batch.initialCount || 0);
        return acc;
    }, {});
    
    res.json({
        totalBatches,
        activeBatches,
        completedBatches,
        totalExpenses,
        totalIncome,
        netProfit,
        profitMargin,
        totalIncubators,
        activeIncubators,
        totalBatteries,
        birdsByType,
        capital: totalExpenses
    });
});

// Initialize database on start
initializeDatabase();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
});

const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');

router.get('/consumption/lines', 
    isAuthenticated, 
    hasRole('energy_manager', 'technologist'), 
    (req, res) => {
        res.json({
            data: [
                { line: 'Assembly Line 1', consumption_kWh: 450, status: 'normal' },
                { line: 'CraftTable', consumption_kWh: 1200, status: 'high' }
            ]
        });
    }
);

router.post('/optimization/recommendations', 
    isAuthenticated, 
    hasRole('technologist'), 
    (req, res) => {
        const { targetLine, newParameters } = req.body;
        res.status(201).json({ 
            message: 'The optimization recommendations have been successfully implemented',
            updatedLine: targetLine 
        });
    }
);

router.get('/kpi/reports', 
    isAuthenticated, 
    hasRole('ceo'), 
    (req, res) => {
        res.json({
            kpi: {
                totalConsumption: 9999,
                efficiencyScore: 102,
                savedCost: "$123456789999"
            }
        });
    }
);

module.exports = router;
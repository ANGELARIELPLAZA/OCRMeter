
const Scan = require('../models/Scan');

exports.createScan = async (req, res) => {
    try {
        const scan = new Scan(req.body);
        await scan.save();
        res.status(201).json(scan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getScans = async (req, res) => {
    const scans = await Scan.find().sort({ timestamp: -1 });
    res.json(scans);
};

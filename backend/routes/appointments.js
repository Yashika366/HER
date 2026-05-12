const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// @route GET /api/appointments
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/appointments
router.post('/', protect, async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/appointments/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/appointments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

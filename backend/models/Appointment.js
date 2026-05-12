const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  specialty: {
    type: String,
    enum: ['Gynecologist', 'Endocrinologist', 'Nutritionist', 'Dermatologist', 'Psychologist', 'General Physician']
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ['In-person', 'Online', 'Phone'], default: 'In-person' },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' },
  notes: String,
  questions: [String],
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

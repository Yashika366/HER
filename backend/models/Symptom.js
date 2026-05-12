const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  symptoms: [{
    name: {
      type: String,
      enum: [
        'Irregular periods', 'Heavy bleeding', 'Acne', 'Hair loss',
        'Excess hair growth', 'Weight gain', 'Fatigue', 'Mood swings',
        'Bloating', 'Headache', 'Pelvic pain', 'Sleep issues',
        'Brain fog', 'Anxiety', 'Depression', 'Cravings'
      ]
    },
    severity: { type: Number, min: 1, max: 5 }
  }],
  period: {
    started: Boolean,
    flow: { type: String, enum: ['Light', 'Medium', 'Heavy', 'None'] },
    painLevel: { type: Number, min: 0, max: 10 }
  },
  mood: {
    type: String,
    enum: ['Great', 'Good', 'Okay', 'Bad', 'Terrible']
  },
  sleep: { type: Number, min: 0, max: 24 },
  exercise: {
    done: Boolean,
    type: String,
    duration: Number
  },
  diet: {
    waterIntake: Number,
    notes: String
  },
  medications: [{
    name: String,
    taken: Boolean
  }],
  notes: { type: String, maxlength: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('Symptom', symptomSchema);

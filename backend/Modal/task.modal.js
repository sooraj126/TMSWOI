const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: 'N/A'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true
  },
  category: {
    type: String,
    enum: ['personal', 'work'],
    required: true
  },
  status: {
    type: String,
    enum: ['notStarted', 'inProgress', 'onHold', 'completed'],
    default: 'notStarted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Task' 
});

module.exports = mongoose.model('Task', taskSchema);

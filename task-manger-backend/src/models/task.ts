import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: String,
  dueDate: Date,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model('Task', taskSchema);

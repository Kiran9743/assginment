import express from 'express';
import Task from '../models/Task';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
router.use(authMiddleware);

// Create Task
router.post('/', async (req: any, res) => {
  const task = new Task({
    ...req.body,
    createdBy: req.user.id,
    history: [{ status: req.body.status || 'To Do' }]
  });
  await task.save();
  res.status(201).json(task);
});

// Fetch All Tasks + Filtering + Pagination
router.get('/', async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter: any = status ? { status } : {};
  const tasks = await Task.find(filter).skip((+page - 1) * +limit).limit(+limit);
  res.json(tasks);
});

// Fetch Task by ID
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: 'Not found' });
  res.json(task);
});

// Update Task
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ msg: 'Not found' });
  res.json(task);
});

// Update Task Status (With Validation)
router.patch('/:id/status', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: 'Not found' });

  const allowed = ['To Do', 'In Progress', 'Done'];
  const current = allowed.indexOf(task.status);
  const next = allowed.indexOf(req.body.status);

  if (next !== current + 1) {
    return res.status(400).json({ msg: 'Invalid status transition' });
  }

  task.status = req.body.status;
  task.history.push({ status: req.body.status });
  await task.save();
  res.json(task);
});

// Delete Task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Search Tasks
router.get('/search', async (req, res) => {
  const { query } = req.query;
  const tasks = await Task.find({
    $or: [
      { title: { $regex: query as string, $options: 'i' } },
      { description: { $regex: query as string, $options: 'i' } }
    ]
  });
  res.json(tasks);
});

// Task History
router.get('/:id/history', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ msg: 'Not found' });
  res.json(task.history);
});

export default router;

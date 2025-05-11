// /server/routes/task.routes.js
const router = require('express').Router();
const { Task } = require('../models');
const verifyToken = require('../middleware/auth.middleware');

// Get all tasks for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single task
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, status, dueDate, imageUrl } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      imageUrl,
      userId: req.userId
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, status, dueDate, imageUrl } = req.body;
    
    // Find task
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update task
    await task.update({
      title,
      description,
      status,
      dueDate,
      imageUrl
    });
    
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Find task
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete task
    await task.destroy();
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
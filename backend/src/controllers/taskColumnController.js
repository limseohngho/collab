// src/controllers/taskColumnController.js
const taskColumnService = require('../services/taskColumnService');

const createColumn = async (req, res) => {
  const { projectId, name, position } = req.body;
  try {
    const result = await taskColumnService.createColumn(projectId, name, position);
    res.status(201).json({ message: 'Column created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create column' });
  }
};

const getColumns = async (req, res) => {
  const { projectId } = req.params;
  try {
    const columns = await taskColumnService.getColumnsByProject(projectId);
    res.json(columns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
};

const updateColumn = async (req, res) => {
  const { columnId } = req.params;
  const { name, position } = req.body;
  try {
    await taskColumnService.updateColumn(columnId, name, position);
    res.json({ message: 'Column updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update column' });
  }
};

const deleteColumn = async (req, res) => {
  const { columnId } = req.params;
  try {
    await taskColumnService.deleteColumn(columnId);
    res.json({ message: 'Column deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete column' });
  }
};

module.exports = {
  createColumn,
  getColumns,
  updateColumn,
  deleteColumn,
};

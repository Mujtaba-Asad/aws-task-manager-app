// /client/src/pages/TaskList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { getAllTasks, deleteTask } from '../services/task.service';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };
  
  const getFilteredTasks = () => {
    if (filter === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.status === filter);
  };
  
  const renderTaskStatus = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'in-progress': 'status-progress',
      'completed': 'status-completed'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>My Tasks</h2>
        <Link to="/tasks/new" className="btn btn-primary">
          <FaPlus /> New Task
        </Link>
      </div>
      
      <div className="task-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : getFilteredTasks().length === 0 ? (
        <div className="no-tasks-message">
          <p>No tasks found. Click "New Task" to create one.</p>
        </div>
      ) : (
        <div className="task-grid">
          {getFilteredTasks().map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                {renderTaskStatus(task.status)}
              </div>
              
              <div className="task-description">
                {task.description?.length > 100 
                  ? `${task.description.slice(0, 100)}...` 
                  : task.description}
              </div>
              
              {task.imageUrl && (
                <div className="task-image">
                  <img src={task.imageUrl} alt={task.title} />
                </div>
              )}
              
              {task.dueDate && (
                <div className="task-due-date">
                  Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </div>
              )}
              
              <div className="task-actions">
                <Link to={`/tasks/${task.id}`} className="btn btn-sm btn-info">
                  <FaEye /> View
                </Link>
                <Link to={`/tasks/edit/${task.id}`} className="btn btn-sm btn-warning">
                  <FaEdit /> Edit
                </Link>
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  className="btn btn-sm btn-danger"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
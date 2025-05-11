// /client/src/pages/TaskDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { getTaskById, deleteTask } from '../services/task.service';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchTask();
  }, [id]);
  
  const fetchTask = async () => {
    try {
      setIsLoading(true);
      const data = await getTaskById(id);
      setTask(data);
    } catch (error) {
      toast.error('Failed to fetch task details');
      navigate('/tasks');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to delete task');
    }
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
  
  if (isLoading) {
    return <div className="loading-spinner">Loading task details...</div>;
  }
  
  if (!task) {
    return <div className="error-message">Task not found</div>;
  }
  
  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        <Link to="/tasks" className="back-link">
          <FaArrowLeft /> Back to Tasks
        </Link>
        
        <div className="task-actions">
          <Link to={`/tasks/edit/${task.id}`} className="btn btn-warning">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDeleteTask} className="btn btn-danger">
            <FaTrash /> Delete
          </button>
        </div>
      </div>
      
      <div className="task-detail-card">
        <div className="task-title-section">
          <h2>{task.title}</h2>
          {renderTaskStatus(task.status)}
        </div>
        
        {task.dueDate && (
          <div className="task-due-date">
            <strong>Due Date:</strong> {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
          </div>
        )}
        
        <div className="task-description-section">
          <h3>Description</h3>
          <p>{task.description || 'No description provided.'}</p>
        </div>
        
        {task.imageUrl && (
          <div className="task-image-section">
            <h3>Image</h3>
            <div className="task-image-container">
              <img src={task.imageUrl} alt={task.title} />
            </div>
          </div>
        )}
        
        <div className="task-metadata">
          <p>Created: {format(new Date(task.createdAt), 'MMMM dd, yyyy HH:mm')}</p>
          <p>Last Updated: {format(new Date(task.updatedAt), 'MMMM dd, yyyy HH:mm')}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
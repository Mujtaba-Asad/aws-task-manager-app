// /client/src/pages/TaskForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import { getTaskById, createTask, updateTask } from '../services/task.service';
import { uploadImage } from '../services/upload.service';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const initialValues = {
    title: '',
    description: '',
    status: 'pending',
    dueDate: null,
    imageUrl: ''
  };
  
  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .max(100, 'Title cannot exceed 100 characters'),
    description: Yup.string()
      .max(500, 'Description cannot exceed 500 characters'),
    status: Yup.string()
      .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status')
      .required('Status is required'),
    dueDate: Yup.date()
      .nullable()
      .min(new Date(), 'Due date cannot be in the past')
  });
  
  useEffect(() => {
    if (isEditMode) {
      fetchTask();
    }
  }, [id]);
  
  const fetchTask = async () => {
    try {
      setIsLoading(true);
      const data = await getTaskById(id);
      // Format the date if exists
      if (data.dueDate) {
        data.dueDate = new Date(data.dueDate);
      }
      initialValues.title = data.title;
      initialValues.description = data.description || '';
      initialValues.status = data.status;
      initialValues.dueDate = data.dueDate;
      initialValues.imageUrl = data.imageUrl || '';
      
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
    } catch (error) {
      toast.error('Failed to fetch task details');
      navigate('/tasks');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should not exceed 2MB');
      return;
    }
    
    setSelectedImage(file);
    setFieldValue('image', file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = Math.min(prev + 10, 90);
          return newProgress;
        });
      }, 200);
      
      const response = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return response.imageUrl;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      // Upload image if selected
      if (selectedImage) {
        const imageUrl = await handleImageUpload(selectedImage);
        values.imageUrl = imageUrl;
      }
      
      if (isEditMode) {
        await updateTask(id, values);
        toast.success('Task updated successfully');
      } else {
        await createTask(values);
        toast.success('Task created successfully');
      }
      
      navigate('/tasks');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading-spinner">Loading task data...</div>;
  }
  
  return (
    <div className="task-form-container">
      <div className="form-header">
        <h2>{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
        <Link to="/tasks" className="back-link">
          <FaArrowLeft /> Back to Tasks
        </Link>
      </div>
      
      <div className="form-card">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Task title"
                  className="form-control"
                />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Task description"
                  className="form-control"
                  rows="4"
                />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="form-control"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <DatePicker
                  id="dueDate"
                  selected={values.dueDate}
                  onChange={(date) => setFieldValue('dueDate', date)}
                  className="form-control"
                  placeholderText="Select due date (optional)"
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  isClearable
                />
                <ErrorMessage name="dueDate" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Task Image</label>
                <div className="image-upload-container">
                  <div className="image-upload-btn">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="image-input"
                    />
                    <label htmlFor="image" className="upload-label">
                      <FaUpload /> Choose Image
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger remove-image"
                        onClick={() => {
                          setImagePreview('');
                          setSelectedImage(null);
                          setFieldValue('imageUrl', '');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
                    {uploadProgress}%
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <FaSave /> {isSubmitting ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
                </button>
                <Link to="/tasks" className="btn btn-secondary">Cancel</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaskForm;
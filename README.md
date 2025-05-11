# aws-task-manager-app
A full-stack cloud-native Task Manager application built with React and Node.js, featuring JWT authentication, PostgreSQL (RDS), image uploads to S3, and deployed on AWS using EC2, Elastic Beanstalk, and Docker.

# Task Manager Application

A full-stack task management application deployed on AWS infrastructure. The application allows users to register, authenticate, create and manage tasks, and upload images for each task.

## Architecture

The application consists of two main components:
- **Frontend**: React application deployed on AWS Elastic Beanstalk
- **Backend**: Node.js/Express API deployed as a Docker container on Amazon EC2
- **Database**: PostgreSQL on Amazon RDS
- **Storage**: Amazon S3 for file uploads

## Features

- User authentication (register/login) with JWT
- CRUD operations for tasks
- Image upload to S3
- Secure access control
- Responsive UI

## Prerequisites

- Node.js (v16 or higher)
- Docker
- AWS CLI configured
- An AWS account with access to the following services:
  - EC2
  - RDS
  - S3
  - Elastic Beanstalk
  - IAM

## Local Development Setup

### Backend Setup

1. Clone the repository:
  git clone https://github.com/yourusername/task-manager.git
  cd task-manager/server
2. Install dependencies:
  npm install
3. Create a `.env` file based on `.env.example` and update the values.

4. Start the development server:
  npm run dev
### Frontend Setup

1. Navigate to the client directory:
  cd ../client
2. Install dependencies:
  npm install
3. Create a `.env` file based on `.env.example` and update the API URL.

4. Start the development server:
  npm start
## AWS Deployment Guide

### 1. Database Setup (Amazon RDS)

1. Create a PostgreSQL database on Amazon RDS:
- Go to the RDS Console
- Click "Create Database"
- Select PostgreSQL engine
- Choose "Free tier" if applicable
- Set DB instance identifier (e.g., "task-manager-db")
- Set master username and password
- Configure VPC and security group to allow connections from your EC2 instance
- Create the database

2. Note the database endpoint, port, database name, username, and password for the next steps.

### 2. S3 Bucket Setup

1. Create an S3 bucket for file storage:
- Go to the S3 Console
- Click "Create bucket"
- Name the bucket (e.g., "task-manager-files-yourusername")
- Choose a region (preferably the same as your other resources)
- Configure bucket settings to block public access
- Create the bucket

2. Create a bucket policy to allow authenticated access:
- Select your bucket and go to the "Permissions" tab
- Add a bucket policy that allows access only from your application

3. Configure CORS to allow requests from your frontend domain:
- In the "Permissions" tab, add a CORS configuration similar to:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-elastic-beanstalk-url.elasticbeanstalk.com"],
    "ExposeHeaders": []
  }
]

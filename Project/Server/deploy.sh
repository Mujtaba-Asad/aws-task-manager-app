# /server/deploy.sh
#!/bin/bash

# AWS ECR repository
ECR_REPOSITORY=your-ecr-repository
AWS_REGION=us-east-1

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY

# Build and tag the Docker image
docker build -t task-manager-backend .
docker tag task-manager-backend:latest $ECR_REPOSITORY:latest

# Push to ECR
docker push $ECR_REPOSITORY:latest

# SSH into EC2 and pull the new image
ssh -i "your-key.pem" ec2-user@your-ec2-instance <<EOF
  docker pull $ECR_REPOSITORY:latest
  docker stop task-manager-backend || true
  docker rm task-manager-backend || true
  docker run -d --name task-manager-backend \
    -p 5000:5000 \
    -e DB_HOST=$DB_HOST \
    -e DB_PORT=$DB_PORT \
    -e DB_NAME=$DB_NAME \
    -e DB_USER=$DB_USER \
    -e DB_PASSWORD=$DB_PASSWORD \
    -e JWT_SECRET=$JWT_SECRET \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -e AWS_REGION=$AWS_REGION \
    -e AWS_S3_BUCKET_NAME=$AWS_S3_BUCKET_NAME \
    -e FRONTEND_URL=$FRONTEND_URL \
    $ECR_REPOSITORY:latest
EOF
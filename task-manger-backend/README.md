#aaaa: Kanban Task Manager Backend Documentation

📄 Project Description

This project is a Kanban Board backend API built using Node.js, TypeScript, Express, and MongoDB, supporting full task management workflows. It enables users to:

Register and log in securely via JWT authentication.

Create, update, delete, and view tasks.

Move tasks between statuses: To Do → In Progress → Done.

Add comments to tasks and assign them to users.

View a history of status changes.

Automatically send email notifications when a task is marked as "Done" via an AWS Lambda function.

Deployable with Docker, Kubernetes, and CloudFormation.

🚿 Setup Steps

1. Clone the repository

git clone https://github.com/your-username/kanban-backend.git
cd kanban-backend

2. Install dependencies

npm install

3. Set up environment variables

Create a .env file in the root:

PORT=3000
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/kanban

4. Start MongoDB locally

docker run -d -p 27017:27017 --name mongodb mongo

5. Run the application

npm run dev

App will be available at http://localhost:3000.

🔢 Env Variable Requirements

Variable

Description

PORT

Port to run the API server

JWT_SECRET

Secret key for JWT token signing

MONGODB_URI

MongoDB connection string

🔄 API Route Documentation

🔐 Auth Routes

Method

Endpoint

Description

POST

/api/auth/register

Register new user

POST

/api/auth/login

Login, returns JWT

POST

/api/auth/logout

Logout (optional)

📅 Task Routes (Protected)

Method

Endpoint

Description

POST

/api/tasks

Create new task

GET

/api/tasks

Get all tasks, support filtering/pagination

GET

/api/tasks/:id

Get a single task by ID

PUT

/api/tasks/:id

Full update of task

PATCH

/api/tasks/:id/status

Change status (with order validation)

DELETE

/api/tasks/:id

Delete task

GET

/api/tasks/search?query=abc

Search tasks

GET

/api/tasks/:id/history

Task status change history

👥 User Routes (Protected)

Method

Endpoint

Description

GET

/api/users/profile

Get logged-in user info

PUT

/api/users/profile

Update user profile

💬 Comments (Protected)

Method

Endpoint

Description

POST

/api/tasks/:id/comments

Add comment

GET

/api/tasks/:id/comments

Get comments

DELETE

/api/tasks/:id/comments/:commentId

Delete comment

📌 Assignment (Protected)

Method

Endpoint

Description

POST

/api/tasks/:id/assign

Assign task to user

DELETE

/api/tasks/:id/assign

Unassign the task

🚧 Docker/Kubernetes Commands

Dockerfile

Use this to build the backend image:

FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

docker-compose.yml

version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/kanban
      - JWT_SECRET=your-secret
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"

Commands

docker-compose build
docker-compose up

Kubernetes (YAML files required)

deployment.yaml

service.yaml

configmap.yaml

secret.yaml

Apply:

kubectl apply -f k8s/

✨ Deployment Instructions

Local: Use npm run dev.

Docker: Use docker-compose up.

Kubernetes:

Use minikube or EKS.

Apply manifests via kubectl apply.

Expose service via LoadBalancer or Ingress.

Cloud (AWS/ECS/EKS):

Use CloudFormation or Terraform.

Ensure MongoDB is hosted (e.g., DocumentDB).

📧 How to Trigger Lambda Email on Done Task

In PATCH /api/tasks/:id/status, when status = "Done":

Publish message to an SNS topic.

The topic triggers an AWS Lambda.

Lambda Function (Node.js):

const AWS = require('aws-sdk');
const ses = new AWS.SES();

exports.handler = async (event) => {
  const email = event.Records[0].Sns.Message; // e.g. user email
  await ses.sendEmail({
    Destination: { ToAddresses: [email] },
    Message: {
      Body: { Text: { Data: 'Your task is marked as DONE!' } },
      Subject: { Data: 'Task Completed' },
    },
    Source: 'noreply@yourdomain.com',
  }).promise();
};

Ensure IAM Role permissions:

Publish to SNS

Send email via SES

🔖 Final Tips

Protect all task/user routes with JWT middleware

Use joi or zod for input validation

Log all errors and use a global error handler

Write unit/integration tests

Submit code with README, Dockerfile, and manifests

This backend supports scalable, secure, and production-ready task workflows, suited for any modern Kanban system.

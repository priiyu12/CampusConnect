# Lab 5: Docker & Containerization

## Project Overview
This project fulfills the Lab 5 assignment requirements by dockerizing the Lab 4 Student REST API and its MongoDB database environment. It sets up the API in a Node.js container, connects it to a MongoDB container via a Docker network, and uses Docker Compose to orchestrate the multi-container application.

## Docker Installation & Verification
The following commands were used to verify that Docker is installed and running:
```bash
docker --version
docker run hello-world
```

## Dockerfile Explanation
The `Dockerfile` is used to build the image for the Student REST API:
- `FROM node:20`: Uses the official Node.js 20 image as the base.
- `WORKDIR /app`: Sets the working directory inside the container.
- `COPY package*.json ./`: Copies package files to leverage Docker layer caching.
- `RUN npm install`: Installs application dependencies.
- `COPY . .`: Copies the remaining application source code.
- `EXPOSE 3000`: Documents that the container listens on port 3000.
- `CMD ["npm", "start"]`: Specifies the command to start the API.

## Docker Image Build
```bash
docker build -t student-api:v1 .
```

## Container Run and Port Mapping
To run the API container in isolation:
```bash
docker run --name student-api -p 3000:3000 student-api:v1
```

## Docker Network Configuration
To allow containers to communicate by name instead of IP address:
```bash
docker network create student-network
docker network connect student-network mongodb
docker network connect student-network student-api
```

## localhost vs MongoDB Service Name
Inside the container, `localhost` refers to the container itself. To connect to MongoDB, the API must use the MongoDB container's service name (`mongodb`) on the Docker network instead of `localhost`.

## Environment Variables
The application uses the following environment variables, configured via `compose.yaml`:
- `PORT: 3000`
- `MONGO_URI: mongodb://mongodb:27017/campusconnect`

## MongoDB Volume and Persistence
A Docker volume is created to persist MongoDB data, ensuring that database records remain intact even if the MongoDB container is stopped and removed. The volume is mounted to the standard `/data/db` directory inside the MongoDB container.
```bash
docker volume create student-mongo-data
docker run -d --name mongodb -v student-mongo-data:/data/db mongo
```

## Docker Compose Configuration
The `compose.yaml` file defines the complete multi-container application:
- `api`: Builds the Student API image and maps port 3000.
- `mongodb`: Runs the official `mongo` image and mounts the persistent volume.

**Commands:**
- Start the application in detached mode: `docker compose up -d`
- View service status: `docker compose ps`
- View container logs: `docker compose logs`
- Stop the application: `docker compose down`

## Postman API Testing
Once the Compose application is running, the API can be tested using Postman via the mapped host port (`http://localhost:3000/students`).

# CampusConnect - Smart University Service Portal

A responsive, premium dashboard-style university portal frontend built with semantic HTML, CSS, and Vanilla JavaScript.

## Features

- **Premium UI/UX:** Clean design inspired by top SaaS products, featuring dark/light modes, micro-interactions, and glassmorphism.
- **Responsive Layout:** CSS Grid architecture that adapts seamlessly from desktop to mobile.
- **Interactive Elements:**
  1. **Theme Switcher:** Toggles between light and dark modes with `localStorage` persistence.
  2. **Dynamic Greeting:** Updates greeting (morning, afternoon, evening) based on time.
  3. **Live Clock:** Displays the current date and time in the topbar.
  4. **Live Search/Filter:** Filters timetable, services, announcements, and events in real-time.
  5. **Expand/Collapse Announcements:** Interactive accordion for announcements.
  6. **Notification Counter:** Interactive badge that decreases when notifications are clicked.
  7. **Show/Hide Events:** Toggles visibility of the upcoming events section.

## Future Service Mapping

The following table maps the frontend UI components to their future backend Web Services (APIs) for integration:

| UI Component | HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication/Profile** | `GET` | `/api/v1/user/profile` | Fetches student details (Name, ID, Dept) |
| **Attendance Card** | `GET` | `/api/v1/attendance/summary` | Retrieves overall attendance percentage |
| **Courses Card** | `GET` | `/api/v1/courses/active` | Retrieves list and count of active courses |
| **Assignments Card** | `GET` | `/api/v1/assignments/pending` | Fetches due assignments count |
| **Exams Card** | `GET` | `/api/v1/exams/upcoming` | Fetches days until next exam |
| **CGPA Card** | `GET` | `/api/v1/grades/cgpa` | Retrieves current CGPA |
| **Notifications** | `GET` | `/api/v1/notifications` | Fetches unread notification count/list |
| **Timetable Table** | `GET` | `/api/v1/timetable/today` | Retrieves today's classes and status |
| **Announcements** | `GET` | `/api/v1/announcements` | Fetches recent announcements |
| **Upcoming Events** | `GET` | `/api/v1/events` | Fetches upcoming university events |
| **Fee Payment Action** | `POST` | `/api/v1/payment/initiate` | Submits a payment request payload |

## Getting Started

Simply open `index.html` in any modern web browser to view the application. No build steps required.

## Lab 2 API Integration (JSONPlaceholder)

The following sections have been updated to fetch data dynamically from REST APIs:

| CampusConnect Section | HTTP Method | API Endpoint | JSON Fields Used |
| :--- | :--- | :--- | :--- |
| **Student Profile** | `GET` | `https://jsonplaceholder.typicode.com/users/1` | `name`, `username`, `email`, `phone` |
| **Announcements** | `GET` | `https://jsonplaceholder.typicode.com/posts?_limit=5` | `title`, `body` |
| **Assignments** | `GET` | `https://jsonplaceholder.typicode.com/todos?userId=1&_limit=5` | `title`, `completed` |

## Lab 3 RESTful Web Services

This repository contains two backend REST APIs developed for Lab 3, demonstrating CRUD operations with in-memory data structures.

### Express.js API (Complete CRUD & Swagger)
Located in the `student-api` directory.
- **Features:** Implements full CRUD operations (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with validation. Includes OpenAPI documentation via Swagger UI.
- **Run Instructions:**
  1. `cd student-api`
  2. `npm install`
  3. `npm start` (or `node server.js`)
- **Endpoints:**
  - Base URL: `http://localhost:3000`
  - Swagger UI: `http://localhost:3000/api-docs`
  - Students API: `http://localhost:3000/students`

### Spring Boot API (Equivalent GET & POST)
Located in the `spring-student-api` directory.
- **Features:** Demonstrates equivalent implementation using Spring Boot Controllers, Services, and Repositories. Implements `GET` and `POST` with Jakarta Validation.
- **Run Instructions:**
  1. `cd spring-student-api`
  2. `./mvnw spring-boot:run`
- **Endpoints:**
  - Base URL: `http://localhost:8080`
  - Students API: `http://localhost:8080/students`

### Sample JSON Payload
```json
{
  "name": "Aarav Patel",
  "email": "aarav@example.com",
  "course": "Computer Science",
  "semester": 5
}
```

## Lab 4 Full-Stack Client & Database Integration

### Architecture Overview
This lab demonstrates a Service-Oriented Architecture (SOA) where a single REST API (Spring Boot) is backed by MongoDB Atlas and consumed by two distinct client applications (a React Web app and an Android Mobile app).

- **Database:** MongoDB Atlas M0 Cluster
- **Backend:** Spring Boot (REST API) with Spring Data MongoDB (Port 8081)
- **Web Client:** React (Vite)
- **Mobile Client:** Android (Kotlin, Jetpack Compose, Retrofit)

### Design Decisions

**1. Why should React and Android access the REST service rather than connect directly to MongoDB?**
- **Security:** Hides database credentials (connection string) from the client-side code where they could be easily extracted.
- **Centralized Logic:** Validation, business logic, and error handling are written once in the API, ensuring consistency across all clients.
- **Decoupling:** If the database technology changes in the future (e.g., from MongoDB to PostgreSQL), the client applications do not need to be rewritten; only the API changes.

**2. Database Constraint**
We applied a **unique index constraint** on the `email` field in the Student document (`@Indexed(unique = true)`). This ensures that no two students can register with the same email address, preventing duplicate accounts and maintaining data integrity.

### Reflection
Consuming the same REST API from both a web client and a mobile client highlights the flexibility of SOA. In both clients, the core network logic (fetching data, parsing JSON, mapping to models) is conceptually identical. However, the implementation differs based on the platform: React uses `axios`/`fetch` and manages state with hooks, while Android uses Retrofit and manages state with Coroutines/ViewModels within the Jetpack Compose lifecycle. The UI/UX paradigms also differ drastically, yet they both reliably display the exact same underlying database state.

## Tech Stack
- Semantic HTML5
- Vanilla CSS3 (CSS Variables, Grid, Flexbox)
- Vanilla JavaScript (ES6)
- [Lucide Icons](https://lucide.dev) (Loaded via CDN)

## Lab 7 - API Gateway, Service Discovery & Cloud Deployment

### Architecture

**Client/Postman** -> **API Gateway** -> **User / Product / Order Services** -> **MongoDB Atlas**

The gateway is the only publicly exposed component. The microservices are isolated within the Docker network and communicate with MongoDB Atlas.

### Why introduce an API Gateway?
An API Gateway provides a single entry point for all clients instead of letting them call each service directly. This hides the internal system structure, simplifies client applications (they only need to know one URL), and centralizes cross-cutting concerns such as logging, authentication, and error handling.

### Static vs Dynamic Service Discovery
In this lab, we used static/config-based discovery via environment variables. While this doesn't require code changes, any location change requires restarting the container with a new environment configuration. A dynamic service registry (like Consul or Kubernetes DNS) allows services to register themselves in real-time, enabling the gateway to automatically detect new or relocated service instances without restarting.

### Reflection
Deploying to the cloud and introducing an API Gateway significantly changed how the system is operated. Instead of managing individual ports and connections for each service locally as in Lab 6, the gateway acts as a unified facade. This makes the system feel like a single cohesive application from the outside, even though it is composed of independent services internally, making it much easier to test and scale.

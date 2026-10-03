# API Design Exercise: CampusConnect Services

## Lab 3: RESTful API Design Explanation

The endpoints defined for the `Student` resource (`/students` and `/students/{id}`) are **resource-oriented** because they focus on the noun (`Student`) representing the entity being manipulated, rather than using action verbs in the URLs (like `/createStudent` or `/getStudent`).

The **HTTP methods** are appropriately mapped to CRUD operations:
- **GET** is used to retrieve data (all students or a specific student by ID).
- **POST** is used to create a new resource.
- **PUT/PATCH** is used to update an existing resource (PUT for full, PATCH for partial).
- **DELETE** is used to remove a resource.

The **HTTP status codes** accurately reflect the outcome:
- **200 OK** signifies a successful retrieval or update.
- **201 Created** specifically indicates successful resource creation.
- **204 No Content** is standard for successful deletions where no body is returned.
- **400 Bad Request** correctly flags invalid client input (e.g., failing validation).
- **404 Not Found** correctly indicates the requested student ID does not exist.
- **500 Internal Server Error** is used for unexpected server-side failures.

---

## Overview
This document outlines the design for the core RESTful APIs that will power the CampusConnect portal. The design follows REST principles, utilizing standard HTTP methods and JSON payloads.

---

## 1. Student Profile API

**Endpoint:** `/api/v1/user/profile`
**Method:** `GET`
**Description:** Fetches the current logged-in student's details.

### Request
*   **Headers:**
    *   `Authorization: Bearer <token>`
*   **Parameters:** None

### Response (Success - 200 OK)
```json
{
  "status": "success",
  "data": {
    "studentId": "2190345",
    "name": "Alex Johnson",
    "department": "Computer Science",
    "semester": 5,
    "email": "alex.j@dau.edu.in",
    "phone": "+91 9876543210"
  }
}
```

### Error Response (Unauthorized - 401)
```json
{
  "status": "error",
  "message": "Invalid or expired authentication token"
}
```

---

## 2. Timetable API

**Endpoint:** `/api/v1/timetable/today`
**Method:** `GET`
**Description:** Retrieves the student's schedule for the current day.

### Request
*   **Headers:**
    *   `Authorization: Bearer <token>`

### Response (Success - 200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "courseCode": "CS201",
      "courseName": "Data Structures",
      "startTime": "09:00",
      "endTime": "10:30",
      "room": "Room 304",
      "instructor": "Dr. Smith",
      "status": "ongoing"
    },
    {
      "courseCode": "CS305",
      "courseName": "Web Services",
      "startTime": "11:00",
      "endTime": "12:30",
      "room": "Lab 2",
      "instructor": "Prof. Davis",
      "status": "upcoming"
    }
  ]
}
```

---

## 3. Fee Payment Initialization API

**Endpoint:** `/api/v1/payment/initiate`
**Method:** `POST`
**Description:** Submits a fee payment request and initializes the payment gateway transaction.

### Request
*   **Headers:**
    *   `Authorization: Bearer <token>`
    *   `Content-Type: application/json`
*   **Body Payload:**
```json
{
  "amount": 25000.00,
  "currency": "INR",
  "paymentPurpose": "Semester 5 Tuition Fee",
  "paymentMethod": "UPI"
}
```

### Response (Success - 201 Created)
```json
{
  "status": "success",
  "data": {
    "transactionId": "TXN987654321",
    "redirectUrl": "https://gateway.bank.com/pay/TXN987654321",
    "expiryTime": "2026-08-16T23:45:00Z"
  }
}
```

### Error Response (Bad Request - 400)
```json
{
  "status": "error",
  "message": "Invalid amount specified. Minimum payment is 100 INR."
}
```

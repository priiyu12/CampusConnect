# Lab 6: Microservices Architecture

## Project Overview
This project decomposes the monolithic CampusConnect backend into three independently runnable microservices (User, Product, and Order). Each service is containerized, has its own dedicated MongoDB database, and they communicate with each other over a shared Docker network.

## Service Boundaries & Responsibilities
- **User Service (Port 3001)**: Manages User resources. Connects to `user-db`.
- **Product Service (Port 3002)**: Manages Product resources. Connects to `product-db`.
- **Order Service (Port 3003)**: Manages Order resources. Validates user and product existence via REST API calls before order creation. Connects to `order-db`.

## Microservices API and Communication Exercise

| Item             | User Service                    | Product Service                  | Order Service                    |
|------------------|---------------------------------|----------------------------------|----------------------------------|
| **Responsibility** | Manage User resources           | Manage Product resources         | Manage Orders & validate references|
| **Port**         | `:3001`                         | `:3002`                          | `:3003`                          |
| **Main resources** | Users                           | Products                         | Orders                           |
| **Key endpoints**  | GET/POST/PUT/DELETE `/users`    | GET/POST/PUT/DELETE `/products`  | POST/GET `/orders`               |
| **Data/database**  | User-owned (`user-db`)          | Product-owned (`product-db`)     | Order-owned (`order-db`)         |

### Service-to-Service Call (Order Validation)
| Field | Design |
|---|---|
| Calling service | Order Service |
| Target service | User Service / Product Service |
| HTTP method | GET |
| Endpoint | `/users/{id}` or `/products/{id}` |
| Request data | Referenced user/product ID |
| Expected response | 200 + requested resource |
| Failure response | 404 for invalid resource; 503 when dependency is unavailable |

## Running the Application
1. Start the entire cluster:
   ```bash
   docker compose up -d
   ```
2. Verify all 6 containers (3 APIs, 3 DBs) are running:
   ```bash
   docker compose ps
   ```
3. Stop the cluster:
   ```bash
   docker compose down
   ```

## Environment Variables & Docker Network
The `compose.yaml` provisions a shared `campus-network` and injects the following variables so no URLs or secrets are hardcoded:
- `USER_SERVICE_PORT=3001`
- `PRODUCT_SERVICE_PORT=3002`
- `ORDER_SERVICE_PORT=3003`
- `USER_MONGO_URI=mongodb://user-db:27017/campusconnect_user`
- `PRODUCT_MONGO_URI=mongodb://product-db:27017/campusconnect_product`
- `ORDER_MONGO_URI=mongodb://order-db:27017/campusconnect_order`
- `USER_SERVICE_URL=http://user-service:3001`
- `PRODUCT_SERVICE_URL=http://product-service:3002`

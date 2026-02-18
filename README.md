# Campus Resource Management System Backend

Backend implementation for the Campus Resource Management System using Spring Boot 3, PostgreSQL, and JWT Authentication.

## Features

- **User Management**: 
    - **Admin**: Full access to manage users and resources. Can view all bookings.
    - **Staff**: Can view resources and make bookings within allocated timings.
    - **Student**: Can view resources and make bookings within allocated timings.
- **Resources**: Labs, Classrooms, Halls+, Equipment.
- **Booking System**: Request, Approve, Cancel bookings.
- **Security**: JWT based authentication with Role-Based Access Control (RBAC).
- **Audit Logging**: Track all actions.
- **Notifications**: Email notifications (mocked).

## Requirements

- Java 17+
- Maven 3.8+
- PostgreSQL

## Setup

1. **Database**: Create a PostgreSQL database named `campus_crm`.
2. **Configuration**: Update `src/main/resources/application.yml` with your database credentials.
3. **Run**:
   ```sh
   mvn spring-boot:run
   ```
4. **Swagger UI**: Visit `http://localhost:8080/swagger-ui.html` for API documentation.

## Frontend Setup

1. **Navigate**: `cd frontend/frontend`
2. **Install**: `npm install`
3. **Run**: `npm run dev`
4. **Access**: Visit `http://localhost:5173`

## Docker

Run with Docker Compose:
```sh
docker-compose up -d
```
[4:52 pm, 18/2/2026] +91 99528 79432: Backend implementation for the Campus Resource Management System using Spring Boot 3, PostgreSQL, and JWT Authentication.

## Features

- *User Management*: 
    - *Admin*: Full access to manage users and resources. Can view all bookings.
    - *Staff*: Can view resources and make bookings within allocated timings.
    - *Student*: Can view resources and make bookings within allocated timings.
- *Resources*: Labs, Classrooms, Halls, Equipment.
- *Booking System*: Request, Approve, Cancel bookings.
- *Security*: JWT based authentication with Role-Based Access Control (RBAC).
- *Audit Logging*: Track all actions.
- *Notifications*: Email notifications (mocked).

## Requirements

- Java 17+
- Maven 3.8+
- PostgreSQL

## Setup
[4:52 pm, 18/2/2026] +91 99528 79432: 1. *Database*: Create a PostgreSQL database named campus_crm.
2. *Configuration*: Update src/main/resources/application.yml with your database credentials.
3. *Run*:
   ```sh
   mvn spring-boot:run

# Full Stack Todo Application (Angular, Spring Boot, PostgreSQL)

This is a complete, containerized full-stack application for managing a simple To-Do list.  
The stack consists of an Angular frontend, a Spring Boot REST API, and a PostgreSQL database, all orchestrated using Docker Compose.

---

## Key Technologies Used

- **Frontend (Client):** Angular 19 and Nginx (The user interface, served statically)  
- **Backend (Server):** Spring Boot (Java) (Provides the REST API endpoints)  
- **Database:** PostgreSQL (Persistent storage for all task data)  
- **Orchestration:** Docker & Docker Compose (Manages the entire runtime environment)  

---

## Project Structure

todo-app/
├── backend/ # Spring Boot REST API
├── client/ # Angular Frontend Source Code & Nginx config
├── docker-compose.yml # Defines and links all 3 services
└── README.md

---

## Prerequisites

To run this application, you must have the following installed:

- **Docker Desktop:** Includes Docker Engine and Docker Compose. Ensure Docker is running.  
- **Git:** For cloning the repository.

---

## Getting Started (One-Command Setup)

### 1. Clone the Repository

Navigate to your desired directory and clone the project:


git clone <your-repository-url>
cd todo-app
2. Build and Run the Stack
Run the following command from the project root (todo-app/).
The --build flag ensures all images are created, and -d runs the containers in detached mode.


docker compose up --build -d
3. Access the Application
Once the containers are up (this may take a minute for the initial builds):

Frontend (Todo App UI): http://localhost:4200

Backend (API Status Check): http://localhost:8080


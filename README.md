# Personal Finance Dashboard

A modern, full-stack Personal Finance Dashboard that allows users to securely track, visualize, and filter their personal transactions. The project features an interactive charting interface and a highly responsive data grid for organizing income and expenses.

![Finance Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![Java 21](https://img.shields.io/badge/Java-21-blue) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6db33f) ![React 19](https://img.shields.io/badge/React-19-61dafb)

## 🛠 Tech Stack

### Backend
* **Java 21**
* **Spring Boot 3**
* **Spring Security** (Basic Authentication)
* **Spring Data JPA** (Hibernate)
* **MySQL 8** (Database)

### Frontend
* **React 19** (Vite)
* **Recharts** (For interactive financial visualizations)
* **Ag-Grid Community** (For robust, sortable, and filterable data tables)
* **Vanilla CSS** (Custom, modern aesthetic UI design)

### Infrastructure & CI/CD
* **Docker & Docker Compose**
* **GitHub Actions** (Automated multi-stage container builds and deployment)

---

## 🚀 How to Run Locally

### 1. Database Setup
The application requires a MySQL database. Start the local database instance using Docker Compose:
```bash
docker-compose up -d finance-db
```
*(The database is exposed locally on port `3307` and mapped to `3306` inside the Docker network. The default database is `finance` with password `password`).*

### 2. Running in Development Mode
During active development, it is best to run the frontend and backend separately for hot-reloading.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```
*Note: The Vite frontend is configured to proxy `/api` requests to the local Spring Boot server running on `http://localhost:8080`.*

### 3. Running in Production Mode (Full Docker)
To run the fully bundled application using the pre-built Docker image from the CI/CD pipeline:
```bash
docker-compose pull
docker-compose up -d
```
The application will be accessible at `http://localhost:8080`.
> **Note for Mac users (Apple Silicon):** The CI/CD pipeline builds the image for `linux/amd64`. If you are on an M-series Mac, Docker Desktop will seamlessly run the container using Rosetta 2 emulation.

---

## 🏗 System Architecture & Workflows

### SPA Integration
This project is configured as a Single Page Application (SPA). 
When building the frontend (`npm run build`), Vite is configured via `vite.config.js` to output the bundled static assets directly into the backend's `/src/main/resources/static` directory.
The Spring Boot backend uses a `SpaController` to intercept all frontend route requests and forward them to `index.html`, allowing React Router to handle client-side navigation without triggering 404 errors from the backend.

### Security
The backend is secured using Spring Security. Unauthenticated requests to `/api/**` will result in a `401 Unauthorized` response. The frontend intercepts these 401s using Axios interceptors and routes the user to the custom Login screen. Upon successful authentication, a session cookie (`JSESSIONID`) is generated and attached to all subsequent requests.

### CI/CD Pipeline
The `.github/workflows/ci-cd.yml` workflow triggers whenever a Pull Request is merged into the `main` branch. It utilizes a Multi-Stage `Dockerfile` to:
1. Build the React frontend using Node.
2. Package the static frontend assets and build the Spring Boot `.jar` using Eclipse Temurin JDK 21.
3. Wrap the `.jar` in a lean JRE container and push the final image (`igorkoishman/finance:latest`) to Docker Hub.

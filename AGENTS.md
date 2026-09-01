<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at /Users/igorkoishman/PycharmProjects/finance/specs/002-file-import-dashboard/plan.md
<!-- SPECKIT END -->

# Agent Technical Summary & Instructions

Welcome, Future Agent! When working on this repository, please adhere to the following architecture and workflow rules:

## 1. Project Structure
- **Backend:** Standard Spring Boot structure under `/src/main/java/com/finance`.
- **Frontend:** React application built with Vite under `/frontend`.
- **Database:** MySQL. Entity models (`Transaction.java`) use generated columns. When modifying Entities, ensure generated columns are marked `insertable = false, updatable = false` to prevent Hibernate exceptions on save.

## 2. Frontend Building and Asset Management
- Vite is configured to output its build directly into the Spring Boot static resources folder: `../src/main/resources/static`.
- **CRITICAL:** If you modify frontend code and need to verify the full stack, you MUST run the build command first:
  `cd frontend && npm run build && cd .. && ./mvnw clean install && ./mvnw spring-boot:run`
- Do not run Maven without building the frontend if you expect your frontend changes to appear on `localhost:8080`.

## 3. SPA Routing Configuration
- The backend relies on `SpaController.java` to forward non-API web paths back to `index.html`. If you add new high-level frontend routes, ensure they are handled gracefully by the controller so hard-refreshes do not result in 404s.

## 4. UI Libraries and Styling
- **Tables:** Use `ag-grid-react` v35+. You MUST explicitly register modules (`ModuleRegistry.registerModules([AllCommunityModule])`) and use the `theme` prop (`themeQuartz`). Legacy ag-grid CSS imports are no longer supported in v35.
- **Charts:** Use `recharts`.
- **Styling:** Use Vanilla CSS. Do not install Tailwind unless explicitly requested by the user. Prioritize modern, beautiful, and dynamic aesthetic designs.

## 5. Security & Authentication
- The app uses Spring Security with Basic Auth (`SecurityConfig.java`). Unauthenticated API requests return a `401`. The frontend handles this via a global Axios interceptor that resets state and displays `Login.jsx`.
- When adding new unprotected endpoints, remember to update `SecurityConfig.java` to `.requestMatchers("/your-endpoint").permitAll()`.

## 6. Deployment & CI/CD
- The multi-stage `Dockerfile` handles building the frontend and backend together. If you change the frontend build directory or the Java version, make sure to update the Dockerfile.
- GitHub Actions automatically pushes to Docker Hub on merge to `main`.
- `docker-compose.yml` mounts the MySQL volume to `finance_mysql_data`. The app container connects using `finance-db:3306`.

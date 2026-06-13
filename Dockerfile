# Stage 1: Build the React frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM eclipse-temurin:21-jdk-alpine AS build-backend
WORKDIR /app
COPY --from=build-frontend /app /app
WORKDIR /app
RUN chmod +x mvnw
RUN ./mvnw clean install -DskipTests

# Stage 3: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build-backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

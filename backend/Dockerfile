# Stage 1: The Build Stage (Use Maven to compile and package the JAR)
# We use a large image here because it contains the build tools (Maven, JDK)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom file and download dependencies first to optimize caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the final executable JAR
COPY src ./src
RUN mvn clean install -DskipTests

# Stage 2: The Runtime Stage (Create a small, production-ready image)
# We use a smaller JRE image for the final container—it only runs the JAR
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR file from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
# Stage 1: Extract the layers
FROM eclipse-temurin:17-jdk-alpine as builder
WORKDIR /app
COPY app.jar app.jar
# Extract the layers from the jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 2: Copy layers into the final image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy layers in order of change frequency (least frequent -> most frequent)
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
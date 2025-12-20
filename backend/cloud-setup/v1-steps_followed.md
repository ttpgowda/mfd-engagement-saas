## backend ready:

### 1. Build the latest JAR:
```aiignore
mvn clean package -DskipTests
```

### 2. Upload the new JAR:
```aiignore
    scp -i "C:/Users/Hi/.ssh/aws_key" target/*.jar ubuntu@52.66.249.82:~/app/app.jar
```

### 3. Upload the updated Docker Compose file:
```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" docker-compose.yml ubuntu@52.66.249.82:~/app/
```

### 4. Restart and Rebuild on Server:
```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "cd ~/app && sudo docker compose down && sudo docker compose up -d --build"
```
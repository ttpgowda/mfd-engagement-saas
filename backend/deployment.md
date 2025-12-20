### Build the latest JAR:

```aiignore
mvn clean package -DskipTests
```

### Upload the new JAR:

```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" target/*.jar ubuntu@52.66.249.82:~/app/app.jar
```

### Upload the updated Docker Compose file:
```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" docker-compose.yml ubuntu@52.66.249.82:~/app/
```

### Restart and Rebuild on Server:
```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "cd ~/app && sudo docker compose down && sudo docker compose up -d --build"
```
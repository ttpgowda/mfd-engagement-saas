Step 0 : MVN Clean

```aiignore
mvn clean package -DskipTests
```

Step 1: Create/Ensure the app folder exists

```aiignore
ssh -o StrictHostKeyChecking=no -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "mkdir -p ~/app"
```

Step 2: Upload your new JAR file
```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" target/*.jar ubuntu@52.66.249.82:~/app/app.jar
```

Step 3: Upload Config Files
```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" Dockerfile docker-compose.yml .env ubuntu@52.66.249.82:~/app/
```

Step 4: Start ONLY the Application (The Fix)
```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "cd ~/app && sudo docker compose up -d --build app"
```